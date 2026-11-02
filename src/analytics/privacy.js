const CAMPAIGN_PARAMETERS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);

export function cleanUrl(value, keepCampaign = false) {
  try {
    const url = new URL(value, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    url.username = '';
    url.password = '';
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (!keepCampaign || !CAMPAIGN_PARAMETERS.has(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

// Autocapture/attribution may nest URL properties. Never transmit arbitrary query
// strings, fragments, input values, or mailto addresses in our event payloads.
export function sanitizeProperties(value, key = '') {
  if (Array.isArray(value)) return value.map(item => sanitizeProperties(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([name]) => !['$input_value', 'attr__value'].includes(name))
      // Heatmaps index point arrays by URL: the URL is a dictionary key,
      // whereas pageviews/attribution put it in a value.
      .map(([name, property]) => [
        /^https?:\/\//.test(name) ? cleanUrl(name) : name,
        sanitizeProperties(property, name),
      ]));
  }
  if (typeof value !== 'string') return value;
  if (value.startsWith('mailto:')) return 'mailto:';
  if (/url|href|referrer/i.test(key) && /^https?:\/\//.test(value)) {
    return cleanUrl(value, /current_url|entry_url/i.test(key));
  }
  return value;
}

export function canTrack({ production, enableLocal, location, navigator }) {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const privacySignal = navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
  return !privacySignal && (enableLocal || (production && !local));
}
