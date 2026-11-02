import posthog from 'posthog-js';
import { canTrack, sanitizeProperties } from './privacy.js';

let enabled = false;
let currentView = 'home';

export function initAnalytics() {
  if (enabled || !canTrack({
    production: import.meta.env.PROD,
    enableLocal: import.meta.env.VITE_POSTHOG_ENABLE_LOCAL === 'true',
    location: window.location,
    navigator: window.navigator,
  })) return;

  // A public, write-only project token belongs in the browser bundle. This is
  // deliberately NOT a personal API key, and requires no GitHub Actions secret.
  const key = import.meta.env.VITE_POSTHOG_KEY || 'phc_oepb3ume4PVA6Rma839qPyH7pQTDLcmhRoKBnVJAT9Jb';
  try {
    posthog.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-06-25',
      person_profiles: 'never',
      persistence: 'localStorage',
      respect_dnt: true,
      capture_pageview: false, // React's archive views do not change the URL.
      capture_pageleave: true,
      autocapture: {
        dom_event_allowlist: ['click'],
        capture_copied_text: false,
        capture_value_css_selector_allowlist: [],
        element_attribute_ignorelist: ['href'],
      },
      rageclick: true,
      capture_dead_clicks: true,
      capture_heatmaps: true,
      capture_performance: { web_vitals: true, network_timing: false },
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      disable_surveys: true,
      disable_session_recording: false,
      enable_recording_console_log: false,
      session_recording: {
        sampleRate: 1,
        maskAllInputs: true,
        maskTextSelector: '[data-private], .ph-mask',
        blockSelector: '.ph-no-capture, [data-private-block]',
        recordCrossOriginIframes: false,
        recordHeaders: false,
        recordBody: false,
      },
      before_send: event => {
        event.properties = sanitizeProperties(event.properties);
        return event;
      },
    });
    posthog.register({ site: 'krishna_portfolio', analytics_schema: 1 });
    enabled = true;
  } catch {
    // Analytics is optional: an unavailable SDK must never prevent rendering.
    enabled = false;
  }
}

export function analyticsEnabled() {
  return enabled && !posthog.has_opted_out_capturing();
}

export function setAnalyticsView(view, viewVisitId) {
  currentView = view;
  if (enabled) posthog.register({ portfolio_view: view, view_visit_id: viewVisitId });
}

export function trackEvent(event, properties = {}, options) {
  if (!analyticsEnabled()) return;
  try {
    posthog.capture(event, {
      portfolio_view: currentView,
      ...properties,
    }, options);
  } catch {
    // Preserve navigation and interactions if storage/network/extensions fail.
  }
}
