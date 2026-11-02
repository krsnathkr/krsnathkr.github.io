const { test, expect } = require('@playwright/test');

async function instrument(page) {
  const errors = [];
  const packets = [];
  const sdk = { url: null };
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/node_modules/.vite/deps/posthog-js.js')) sdk.url = request.url();
  });
  await page.addInitScript(() => {
    window.__analyticsEvents = [];
    // PostHog intentionally suppresses automated visitors. Model a human only
    // inside these intercepted tests; production bot filtering remains enabled.
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  // Exercise the actual SDK's before_send path and network transport. Every
  // remote request is intercepted, so tests cannot pollute the real project.
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') {
      if (url.pathname === '/src/analytics/posthog.js') {
        const response = await route.fetch();
        let body = await response.text();
        expect(body).toContain('event.properties = sanitizeProperties(event.properties);');
        body = body.replace('event.properties = sanitizeProperties(event.properties);',
          'event.properties = sanitizeProperties(event.properties); window.__analyticsEvents.push(JSON.parse(JSON.stringify(event)));');
        body = body.replace('} catch {\n    // Analytics', '} catch (error) {\n    window.__analyticsInitError = error.stack;\n    // Analytics');
        return route.fulfill({ response, body });
      }
      return route.continue();
    }
    if (url.hostname.endsWith('posthog.com')) {
      if (url.pathname.includes('/e/')) packets.push(route.request().postDataBuffer());
      return route.fulfill({
        status: 200,
        contentType: url.pathname.endsWith('.js') ? 'application/javascript' : 'application/json',
        body: url.pathname.endsWith('.js') ? '' : JSON.stringify({ featureFlags: {}, sessionRecording: false, status: 1 }),
      });
    }
    return route.abort();
  });
  return { errors, packets, sdk };
}

const events = (page, name) => page.evaluate(eventName => window.__analyticsEvents.filter(e => !eventName || e.event === eventName), name);

test('SDK configuration, StrictMode deduplication, source views and semantic clicks', async ({ page }) => {
  const { errors, packets, sdk } = await instrument(page);
  await page.goto('/?utm_source=linkedin&private_value=do-not-send#private-fragment');
  await expect(page.getByRole('heading', { name: 'Krishna Thakar', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.__analyticsInitError)).toBeUndefined();
  expect(await page.evaluate(async () => (await import('/src/analytics/posthog.js')).analyticsEnabled())).toBe(true);
  await expect.poll(async () => (await events(page, '$pageview')).length).toBe(1);
  const configuration = await page.evaluate(async url => {
    const { default: posthog } = await import(url);
    return Object.fromEntries(['api_host', 'person_profiles', 'session_recording', 'capture_exceptions', 'capture_heatmaps'].map(k => [k, posthog.config[k]]));
  }, sdk.url);
  expect(configuration.api_host).toBe('https://us.i.posthog.com');
  expect(configuration.person_profiles).toBe('never');
  expect(configuration.session_recording).toMatchObject({ sampleRate: 1, maskAllInputs: true, recordHeaders: false, recordBody: false });
  expect(configuration.capture_heatmaps).toBe(true);

  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  expect((await events(page, 'theme_toggled'))[0].properties.target).toBe('dark');
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);

  const popup = page.waitForEvent('popup');
  await page.locator('#view-cv-btn').click();
  await (await popup).close();
  expect((await events(page, 'resume_clicked'))[0].properties).toMatchObject({ placement: 'hero', destination_host: 'drive.google.com' });

  await page.getByRole('button', { name: 'All Projects', exact: true }).click();
  await expect(page.locator('[data-analytics-view="projects_archive"]')).toBeVisible();
  expect((await events(page, 'archive_opened'))[0].properties.portfolio_view).toBe('home');
  expect((await events(page, '$pageview')).map(e => e.properties.portfolio_view)).toEqual(['home', 'projects_archive']);
  const archive = page.locator('[data-analytics-view="projects_archive"]');
  const category = await archive.locator('button').nth(2).innerText();
  await archive.getByRole('button', { name: category, exact: true }).click();
  expect((await events(page, 'project_filter_changed'))[0].properties).toMatchObject({ category, previous_category: 'All' });
  const card = archive.locator('[data-analytics-content]').filter({ has: page.locator('a') }).first();
  const itemId = await card.getAttribute('data-analytics-id');
  const projectPopup = page.waitForEvent('popup');
  await card.locator('a').click();
  await (await projectPopup).close();
  expect((await events(page, 'content_clicked'))[0].properties).toMatchObject({ content_type: 'project', content_id: itemId, placement: 'archive' });
  await archive.getByRole('button', { name: 'Back to Portfolio', exact: true }).click();
  expect((await events(page, 'archive_closed'))[0].properties.portfolio_view).toBe('projects_archive');
  expect((await events(page, '$pageview')).map(e => e.properties.portfolio_view)).toEqual(['home', 'projects_archive', 'home']);
  await expect.poll(() => packets.length).toBeGreaterThan(0);
  const serialized = JSON.stringify(await events(page));
  const leaks = [];
  function findLeaks(value, path = '') {
    if (typeof value === 'string' && /do-not-send|private-fragment/.test(value)) leaks.push(path);
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, entry]) => {
      findLeaks(key, `${path}.[key]`);
      findLeaks(entry, `${path}.${key}`);
    });
  }
  findLeaks(await events(page));
  expect(leaks).toEqual([]);
  expect(serialized.includes('do-not-send')).toBe(false);
  expect(serialized.includes('private-fragment')).toBe(false);
  expect(serialized).toContain('linkedin');
  expect(errors).toEqual([]);
});

test('section/content reach, hidden home views and view summary identities', async ({ page }) => {
  await instrument(page);
  await page.goto('/');
  await expect.poll(async () => (await events(page, 'section_viewed')).some(e => e.properties.section === 'home')).toBe(true);
  await page.locator('#research').scrollIntoViewIfNeeded();
  await expect.poll(async () => (await events(page, 'section_viewed')).some(e => e.properties.section === 'research')).toBe(true);
  await expect.poll(async () => (await events(page, 'content_viewed')).some(e => e.properties.content_type === 'research')).toBe(true);
  const paper = page.locator('[data-analytics-content="research:2"]');
  const popup = page.waitForEvent('popup');
  await paper.locator('a').first().click();
  await (await popup).close();
  expect((await events(page, 'content_clicked'))[0].properties).toMatchObject({ content_type: 'research', content_id: '2' });
  await page.getByRole('button', { name: 'All Experience', exact: true }).click();
  await expect(page.locator('[data-analytics-view="experience_archive"]')).toBeVisible();
  await page.waitForTimeout(1600);
  expect((await events(page, 'section_viewed')).filter(e => e.properties.portfolio_view === 'experience_archive')).toHaveLength(0);
  const summary = (await events(page, 'portfolio_view_summary')).find(e => e.properties.reason === 'view_changed');
  expect(summary.properties.sections_seen).toContain('research');
  expect(summary.properties.sections_not_seen).toContain('contact');
  expect(summary.properties.view_visit_id).toBeTruthy();
  expect(summary.properties.summary_sequence).toBeGreaterThan(0);
  expect((await events(page, 'section_engagement')).length).toBeGreaterThan(0);
});

test('idle and hidden tabs stop reading-time accounting', async ({ page }) => {
  await page.goto('/tests/fixtures/analytics.html');
  await expect(page.locator('#home')).toBeVisible();
  // Isolate the tracker against real browser geometry with a controllable clock.
  await page.clock.install();
  await page.evaluate(async () => {
    const { createPortfolioTracker } = await import('/src/analytics/tracker.js');
    window.__trackerEvents = [];
    window.__tracker = createPortfolioTracker({
      capture: (event, properties) => window.__trackerEvents.push({ event, properties }),
      setView: () => {},
    });
    window.__tracker.startView('home');
  });
  await page.clock.runFor(5000);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(20_000);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(40_000); // only the first 30 seconds may count
  await page.evaluate(() => window.__tracker.destroy());
  const result = await page.evaluate(() => window.__trackerEvents);
  const summaries = result.filter(e => e.event === 'portfolio_view_summary');
  const final = summaries.at(-1).properties;
  expect(final.active_seconds).toBeGreaterThan(30);
  expect(final.active_seconds).toBeLessThanOrEqual(35);
  expect(new Set(summaries.map(e => e.properties.view_visit_id)).size).toBe(1);
  const time = result.filter(e => e.event === 'section_engagement').reduce((sum, e) => sum + e.properties.active_seconds, 0);
  expect(time).toBeCloseTo(final.active_seconds, 0);
});

test('gallery opens/closes once, interest expansion and no synthetic music plays', async ({ page }) => {
  const { errors } = await instrument(page);
  await page.goto('/');
  const photo = page.locator('[data-analytics-content="photo:photo-2"]');
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await photo.locator('img').evaluate(image => { image.loading = 'eager'; return image.decode(); });
  await photo.click();
  expect((await events(page, 'gallery_photo_opened'))[0].properties.photo_id).toBe('photo-2');
  const viewsBefore = (await events(page, 'content_viewed')).length;
  await page.waitForTimeout(1600);
  expect((await events(page, 'content_viewed')).length).toBe(viewsBefore);
  await page.getByRole('dialog', { name: 'Gallery photo' }).locator('img').click();
  expect(await events(page, 'gallery_photo_closed')).toHaveLength(1);
  await expect(page.getByRole('dialog', { name: 'Gallery photo' })).toHaveCount(0);
  await page.mouse.move(0, 0);
  const interest = page.getByRole('button', { name: 'Rock Climbing', exact: false });
  await interest.hover();
  await expect(interest).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(async () => (await events(page, 'interest_expanded')).some(e => e.properties.interest === 'Rock Climbing')).toBe(true);
  expect(await events(page, 'music_played')).toHaveLength(0);
  expect(errors).toEqual([]);
});

test('privacy signals and local development exclusion', async ({ page }) => {
  await instrument(page);
  await page.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { value: true }));
  await page.goto('/');
  await expect(page.locator('#home')).toBeVisible();
  expect(await events(page)).toHaveLength(0);
  const privacy = await page.evaluate(async () => {
    const { canTrack, sanitizeProperties } = await import('/src/analytics/privacy.js');
    return {
      local: canTrack({ production: true, enableLocal: false, location: { hostname: 'localhost' }, navigator: {} }),
      dev: canTrack({ production: false, enableLocal: false, location: { hostname: 'example.com' }, navigator: {} }),
      live: canTrack({ production: true, enableLocal: false, location: { hostname: 'krsnathkr.github.io' }, navigator: {} }),
      dnt: canTrack({ production: true, enableLocal: true, location: { hostname: 'example.com' }, navigator: { doNotTrack: '1' } }),
      safe: sanitizeProperties({ $current_url: 'https://example.com/?utm_source=cv&email=secret#secret', $heatmaps_data: { 'https://example.com/?private=secret#secret': [] }, $elements: [{ attr__href: 'mailto:private@example.com', attr__value: 'secret' }], $input_value: 'secret' }),
    };
  });
  expect(privacy).toMatchObject({ local: false, dev: false, live: true, dnt: false });
  expect(JSON.stringify(privacy.safe)).not.toContain('secret');
  expect(privacy.safe.$current_url).toBe('https://example.com/?utm_source=cv');
});
