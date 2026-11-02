import { contentProperties } from './content.js';
import { cleanUrl } from './privacy.js';

export const SECTIONS = ['home', 'experience', 'research', 'work', 'education', 'techstack', 'achievements', 'gallery', 'interests', 'contact'];
const IDLE_MS = 30_000;
const EXPOSURE_MS = 1_000;
const FLUSH_MS = 15_000;

// Kept independent from the SDK so behavior can be exercised against a real DOM
// without sending synthetic visits to the production PostHog project.
export function createPortfolioTracker({ capture: send, setView, win = window, doc = document }) {
  let visit;
  let lastActivity = performance.now();
  let lastTick = lastActivity;
  let lastFlush = lastActivity;
  let frame;

  function capture(event, properties, options) {
    send(event, { view_visit_id: visit?.id, ...properties }, options);
  }

  function visiblePixels(element) {
    if (!element?.isConnected || !element.getClientRects().length) return 0;
    const rect = element.getBoundingClientRect();
    const width = Math.min(rect.right, win.innerWidth) - Math.max(rect.left, 0);
    const height = Math.min(rect.bottom, win.innerHeight) - Math.max(rect.top, 36); // sticky ticker
    if (width < Math.min(rect.width / 2, 100) || height < Math.min(rect.height / 2, 160, win.innerHeight / 4)) return 0;
    return Math.max(0, height);
  }

  function getRecord(key, properties, kind) {
    if (!visit.records.has(key)) visit.records.set(key, {
      kind, properties, exposed: false, visibleMs: 0, pendingMs: 0, totalMs: 0,
    });
    return visit.records.get(key);
  }

  function scrollDepth() {
    if (!visit || doc.visibilityState !== 'visible') return;
    const height = doc.documentElement.scrollHeight;
    const scrollable = Math.max(1, height - win.innerHeight);
    // A short page is fully seen immediately; a long page begins at 0% scroll.
    const percent = height <= win.innerHeight ? 100 : Math.min(100, Math.max(0, Math.round(win.scrollY / scrollable * 100)));
    visit.maxScroll = Math.max(visit.maxScroll, percent);
    for (const milestone of [25, 50, 75, 90, 100]) {
      if (percent >= milestone && !visit.milestones.has(milestone)) {
        visit.milestones.add(milestone);
        capture('scroll_depth_reached', { depth_percent: milestone });
      }
    }
  }

  function tick() {
    const now = performance.now();
    // Never count a suspended tab, idle time, or a delayed background timer as reading.
    const delta = Math.max(0, Math.min(now - lastTick, 1_000, lastActivity + IDLE_MS - lastTick));
    lastTick = now;
    if (!visit) return;
    if (doc.visibilityState !== 'visible' || now - lastActivity >= IDLE_MS) {
      for (const record of visit.records.values()) record.visibleMs = 0;
      return;
    }
    const root = doc.querySelector(`[data-analytics-view="${visit.view}"]`);
    if (!root) return;
    if (doc.querySelector('[aria-modal="true"]')) {
      // The lightbox obscures the portfolio; its open/close events measure the
      // photo interaction without attributing reading to the covered content.
      for (const record of visit.records.values()) record.visibleMs = 0;
      visit.activeMs += delta;
      if (now - lastFlush >= FLUSH_MS) flush('heartbeat');
      return;
    }
    const seen = new Set();
    let dominant;
    let greatestPixels = 0;
    for (const id of SECTIONS) {
      const element = root.querySelector(`#${id}`);
      const pixels = visiblePixels(element);
      if (!pixels) continue;
      const record = getRecord(`section:${id}`, { section: id, section_position: SECTIONS.indexOf(id) + 1 }, 'section');
      seen.add(record);
      if (pixels > greatestPixels) {
        greatestPixels = pixels;
        dominant = record;
      }
    }
    const visibleContent = [];
    for (const element of root.querySelectorAll('[data-analytics-content]')) {
      if (!visiblePixels(element)) continue;
      const record = getRecord(`content:${element.dataset.analyticsContent}:${element.dataset.analyticsPlacement}`, contentProperties(element), 'content');
      seen.add(record);
      visibleContent.push(record);
    }
    for (const record of visit.records.values()) {
      record.visibleMs = seen.has(record) ? record.visibleMs + delta : 0;
      if (!record.exposed && record.visibleMs >= EXPOSURE_MS) {
        record.exposed = true;
        capture(`${record.kind}_viewed`, record.properties);
        if (record.kind === 'section') visit.seenSections.add(record.properties.section);
      }
    }
    if (dominant) visit.lastSection = dominant.properties.section;
    // Section reading time is assigned to the most visible section; short
    // neighboring sections do not multiply the total. Items track exposure time.
    for (const record of new Set([dominant, ...visibleContent].filter(Boolean))) {
      record.pendingMs += delta;
      record.totalMs += delta;
    }
    visit.activeMs += delta;
    scrollDepth();
    if (now - lastFlush >= FLUSH_MS) flush('heartbeat');
  }

  function flush(reason, options) {
    if (!visit) return;
    for (const record of visit.records.values()) {
      if (record.pendingMs < 250) continue;
      capture(`${record.kind}_engagement`, {
        ...record.properties,
        active_seconds: Math.round(record.pendingMs) / 1000,
        reason,
      }, options);
      record.pendingMs = 0; // incremental, so summing events never double-counts
    }
    lastFlush = performance.now();
  }

  function summarize(reason, options) {
    if (!visit) return;
    capture('portfolio_view_summary', {
      reason,
      summary_sequence: ++visit.summarySequence,
      active_seconds: Math.round(visit.activeMs) / 1000,
      max_scroll_percent: visit.maxScroll,
      sections_seen: [...visit.seenSections],
      sections_not_seen: visit.view === 'home' ? SECTIONS.filter(id => !visit.seenSections.has(id)) : [],
      last_section: visit.lastSection,
    }, options);
  }

  function startView(view) {
    if (visit?.view === view) return; // React StrictMode must not duplicate visits.
    tick();
    flush('view_changed');
    summarize('view_changed');
    visit = {
      id: crypto.randomUUID(), view, summarySequence: 0,
      records: new Map(), seenSections: new Set(), milestones: new Set(), maxScroll: 0, activeMs: 0,
    };
    setView(view, visit.id);
    lastTick = performance.now();
    lastActivity = lastTick;
    lastFlush = lastTick;
    capture('$pageview', { $current_url: cleanUrl(win.location.href, true), $pathname: win.location.pathname, portfolio_view: view });
    capture('portfolio_viewed', { view });
    // React has already committed this view; geometry is read on the next frame.
    win.cancelAnimationFrame(frame);
    frame = win.requestAnimationFrame(() => { tick(); scrollDepth(); });
  }

  function activity() {
    // Settle the old interval before resetting the idle clock.
    tick();
    lastActivity = performance.now();
  }

  function handleClick(event) {
    if (!(event.target instanceof Element) || event.defaultPrevented) return;
    const target = event.target.closest('a, [data-analytics-event]');
    if (!target || target.closest('.ph-no-capture, [data-private-block]')) return;
    const element = target.closest('[data-analytics-content]');
    const data = target.dataset;
    const properties = {};
    for (const field of ['channel', 'placement', 'name', 'target', 'category']) {
      const value = data[`analytics${field[0].toUpperCase()}${field.slice(1)}`];
      if (value) properties[field] = value;
    }
    if (element) Object.assign(properties, contentProperties(element));
    if (target instanceof HTMLAnchorElement) {
      const destination = cleanUrl(target.href);
      if (destination) {
        const url = new URL(destination);
        properties.destination_host = url.hostname;
        properties.destination_path = url.pathname;
        properties.outbound = url.origin !== win.location.origin;
      } else if (target.protocol === 'mailto:') properties.channel = 'email';
      else return;
    }
    capture(data.analyticsEvent || (element ? 'content_clicked' : 'outbound_link_clicked'), {
      section: target.closest('section[id], header[id]')?.id,
      ...properties,
    });
  }

  function handleVisibility() {
    if (doc.visibilityState === 'hidden') {
      tick();
      flush('tab_hidden', { transport: 'sendBeacon' });
      summarize('tab_hidden', { transport: 'sendBeacon' });
      for (const record of visit?.records.values() || []) record.visibleMs = 0;
    } else {
      lastTick = performance.now();
      lastActivity = lastTick;
    }
  }

  function handlePageHide() {
    tick();
    flush('pagehide', { transport: 'sendBeacon' });
    summarize('pagehide', { transport: 'sendBeacon' });
  }

  const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'];
  // Activity can be frequent. Only sampling the idle clock is needed for pointer
  // movement; geometry/measurement otherwise runs twice per second.
  function handleActivity() {
    if (performance.now() - lastActivity > 500) activity();
  }
  activityEvents.forEach(name => win.addEventListener(name, handleActivity, { passive: true }));
  // Capture before React updates/unmounts buttons, so event properties describe
  // the action taken (e.g. dark -> light), not the next rendered button state.
  doc.addEventListener('click', handleClick, true);
  doc.addEventListener('visibilitychange', handleVisibility);
  win.addEventListener('pagehide', handlePageHide);
  const interval = win.setInterval(tick, 500);

  return {
    startView,
    destroy() {
      tick();
      flush('cleanup');
      summarize('cleanup');
      win.clearInterval(interval);
      win.cancelAnimationFrame(frame);
      activityEvents.forEach(name => win.removeEventListener(name, handleActivity));
      doc.removeEventListener('click', handleClick, true);
      doc.removeEventListener('visibilitychange', handleVisibility);
      win.removeEventListener('pagehide', handlePageHide);
    },
  };
}
