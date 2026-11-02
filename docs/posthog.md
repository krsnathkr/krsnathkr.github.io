# Portfolio analytics

This site sends production browser events to US PostHog project **705364**:
https://us.posthog.com/project/705364

The public `phc_` token in `src/analytics/posthog.js` only permits ingestion. It
is intended for the browser bundle; it is not a personal API key and needs no
GitHub Actions secret. The existing Pages deployment installs the SDK through
`npm ci` and bundles the integration through `npm run build`.

## Activate and verify

1. Deploy these changes using the repository's existing GitHub Pages workflow.
2. In PostHog, complete Product Analytics, Web Analytics, and Session Replay
   onboarding. The data warehouse/import screen can be skipped: this static
   portfolio has no database to connect.
3. In Session Replay settings, enable recording for the project. The SDK requests
   a 100% recording sample; project restrictions, ingestion limits, browser privacy
   signals, ad blockers, or network failures can still prevent capture. Enable
   heatmaps in project settings if the product asks for them. Error capture and
   web vitals are also configured in code.
4. Open the deployed portfolio in a normal browser, then inspect **Activity / Live
   events**. Expect `$pageview`, `portfolio_viewed`, then `section_viewed` after
   one second of exposure. Open a project, an archive, and the résumé and check the
   corresponding events. Find that session in Replay to confirm recordings arrive.
5. Exclude your own visits from reports using PostHog's internal-user filters.
   Installation cannot recover historical visitor behavior. The existing Google
   Analytics integration remains available for historical comparisons.

Cloud test requests are intercepted and do **not** verify server receipt or
recording ingestion. This environment initially blocked live PostHog traffic;
its draft now allows `us.i.posthog.com`, `us-assets.i.posthog.com`, and
`us.posthog.com`. Save those environment settings to enable a live cloud check.
Visitors' browsers use their own network access after deployment.

## What is measured

| Event | Useful breakdowns / meaning |
| --- | --- |
| `portfolio_viewed`, `$pageview` | `portfolio_view`: `home`, `projects_archive`, `experience_archive`; archives are manual virtual views because React doesn't change the URL |
| `section_viewed` | `section`, `section_position`; one second of active visible exposure, once per view visit |
| `section_engagement` | Incremental `active_seconds` attributed to the most visible section; sum these events |
| `content_viewed`, `content_engagement` | `content_type`, stable `content_id`, `content_title`, `category`, `tags`, `placement`; includes projects, research, experience, achievements, photos |
| `content_clicked` | Same item identity plus destination host/path; compare clicks with **exposed** items |
| `navigation_clicked`, `archive_opened`, `archive_closed` | Target and placement; archive actions retain the source view |
| `project_filter_changed` | Category, previous category, result count; selecting the current filter does not count again |
| `resume_clicked` | Hero vs contact placement; an intent to open Google Drive, **not** proof of a download |
| `contact_clicked`, `social_clicked` | Email, LinkedIn, GitHub, Scholar, and placement; no email address is sent as a custom property |
| `research_contributor_clicked`, `highlight_clicked`, `interest_link_clicked` | Distinguish advisor, ticker, and hobby links from paper/project clicks |
| `gallery_photo_opened`, `gallery_photo_closed` | Stable photo ID and wall-clock `duration_ms` while open; background impressions pause under the lightbox |
| `interest_expanded`, `font_changed` | Actual hover/focus/touch expansion and the optional font switch |
| `music_played`, `music_paused`, `music_volume_changed` | Actual audio playback, listening duration and deliberate volume changes; autoplaying hidden hobby videos are not interest signals |
| `theme_toggled` | Requested target theme |
| `scroll_depth_reached` | 25/50/75/90/100% of the scrollable distance, once per milestone per virtual-view visit |
| `portfolio_view_summary` | Seen/missed sections, active seconds, maximum scroll, last section; cumulative snapshot described below |

SDK autocapture adds clicks, rage/dead clicks, heatmaps, exceptions, web vitals,
referral/campaign attribution, browser/device information, and session identifiers.
Public on-page link text can be captured. Nothing tracks activity on GitHub,
LinkedIn, Google Drive, or other sites **after** the visitor follows a link.

Section IDs, in order: `home`, `experience`, `research`, `work` (Projects),
`education`, `techstack`, `achievements`, `gallery`, `interests`, `contact`.

## Create the “Portfolio interest & missed content” dashboard

Create these insights in project 705364, use the same date window, and add them
to a dashboard with that name. The public ingestion token cannot create account
dashboards; these definitions do not imply a dashboard has been created.

1. **Reach / missed sections:** count unique sessions with `section_viewed`,
   broken down by `section`, divided by unique sessions with `portfolio_viewed`
   filtered to `portfolio_view = home`. The complement is the missed-section
   rate. Keep all section IDs visible even when a section has zero events.
2. **Attention:** sum `section_engagement.active_seconds` by section. Divide by
   section-viewing sessions for average attention among people who reached it.
3. **Project and research click-through:** use a funnel `content_viewed` →
   `content_clicked`, holding `content_type`, `content_id`, and `placement`
   constant. Count unique sessions, not raw events. Low reach suggests placement;
   high reach with low click-through suggests the description/link needs work.
4. **Conversions:** session funnels from home `portfolio_viewed` to
   `resume_clicked` and `contact_clicked`, split by placement/channel.
5. **Archive discovery:** funnel home → `archive_opened` →
   `project_filter_changed` → archive `content_clicked`, holding session constant.
6. **Less-obvious features:** trends for `gallery_photo_opened`,
   `interest_expanded`, and `music_played`, divided by their section exposure when
   comparing rates. Passive hover is a weaker signal than an outbound click.
7. **Friction:** inspect rage/dead clicks, Error Tracking, and web vitals. Open
   recordings from visitors who saw a section but did not take the next action.

Break down reports by device type, browser, referring domain, campaign/source,
new/returning visitors, and `portfolio_view`. Compare mobile and desktop reach
before changing content: a layout problem can look like lack of interest.

Every event has `site = krishna_portfolio`, `analytics_schema = 1`, and a
`view_visit_id`. A return from an archive starts a new home view visit. Section
and content impressions are deduplicated **within that visit**; use unique
session counts for visitor-level reach and rate comparisons.

`portfolio_view_summary` is emitted when the tab is hidden, the page exits, or the
view changes. Those are cumulative snapshots, not additive events. For a visit
report, take the latest `summary_sequence` for each `view_visit_id`; never sum
all summary snapshots or use their raw count as the number of visits. Time in
`section_engagement` / `content_engagement` is incremental and can be summed.
Item-visible time can overlap between cards and is not proof someone read them.

## Development and data controls

Tracking is disabled in development and on loopback hosts by default. To inspect
local events deliberately: `VITE_POSTHOG_ENABLE_LOCAL=true npm run dev`.
That sends real events unless requests are intercepted. Optional overrides are
`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`; never put a personal API key in a
`VITE_` variable. Vite compiles these values into the public browser bundle.

`npm run test:analytics` starts a dedicated local server and runs browser tests
with all remote requests intercepted. Use the installed Chromium or set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; otherwise install Playwright Chromium
with `npx playwright install chromium`.

Hidden tabs and inactivity beyond 30 seconds do not accrue reading time. Inputs
are masked in replay, input/clipboard values and network bodies/headers aren't
recorded, no `identify` call is made, and person profiles are disabled. Anonymous
device IDs persist in localStorage. Do Not Track and Global Privacy Control
disable this PostHog integration. Event URLs strip fragments and arbitrary query
parameters; explicit UTM campaign parameters are retained for attribution.
Avoid putting private content or credentials in URLs/campaign parameters. Mark
future sensitive content with `data-private` (mask text), or
`data-private-block` / `ph-no-capture` (exclude capture).

Session replay and autocapture should be reflected in the site's privacy
disclosure and any consent controls required for its visitors. The existing
Google Analytics snippet has its own separate settings.
