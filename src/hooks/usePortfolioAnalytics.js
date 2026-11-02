import { useEffect } from 'react';
import { analyticsEnabled, setAnalyticsView, trackEvent } from '../analytics/posthog.js';
import { createPortfolioTracker } from '../analytics/tracker.js';

let tracker;
let subscribers = 0;

export default function usePortfolioAnalytics(view) {
  useEffect(() => {
    if (!analyticsEnabled()) return;
    subscribers += 1;
    tracker ??= createPortfolioTracker({ capture: trackEvent, setView: setAnalyticsView });
    tracker.startView(view);
    return () => {
      subscribers -= 1;
      // StrictMode and view changes remount effects synchronously. Defer teardown
      // to avoid duplicate pageviews/listeners while still cleaning up real unmounts.
      queueMicrotask(() => {
        if (subscribers === 0) {
          tracker?.destroy();
          tracker = undefined;
        }
      });
    };
  }, [view]);
}
