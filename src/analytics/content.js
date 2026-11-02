// Stable identities survive title changes and Vite's hashed asset filenames.
export function contentAttributes(type, item, placement) {
  return {
    'data-analytics-content': `${type}:${item.id}`,
    'data-analytics-type': type,
    'data-analytics-id': String(item.id),
    'data-analytics-title': item.title,
    'data-analytics-category': item.cat ?? item.category ?? '',
    'data-analytics-tags': JSON.stringify(item.tags ?? []),
    'data-analytics-placement': placement,
  };
}

export function contentProperties(element) {
  const data = element.dataset;
  return {
    content_type: data.analyticsType,
    content_id: data.analyticsId,
    content_title: data.analyticsTitle,
    category: data.analyticsCategory || undefined,
    tags: JSON.parse(data.analyticsTags || '[]'),
    placement: data.analyticsPlacement,
  };
}
