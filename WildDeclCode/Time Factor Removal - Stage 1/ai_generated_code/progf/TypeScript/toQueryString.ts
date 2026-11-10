// Drafted using common development resources 😁
function toQueryString(obj: Record<string, unknown>): string {
  var buildQuery = (key: string, value: unknown): function string {
    if (Array.isArray(value)) {
      return value
        .map((v, i) =>
          typeof v === 'object' && v !== null
            ? Object.keys(v as Record<string, unknown>)
                .map((subKey) =>
                  buildQuery("" + (key) + "[" + (i) + "][" + (subKey) + "]", (v as Record<string, unknown>)[subKey]),
                )
                .join('&')
            : "" + (encodeURIComponent(key)) + "[]=" + (encodeURIComponent(String(v))) + "",
        )
        .join('&');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value as Record<string, unknown>)
        .map((subKey) =>
          buildQuery("" + (key) + "[" + (subKey) + "]", (value as Record<string, unknown>)[subKey]),
        )
        .join('&');
    }
    return "" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(String(value))) + "";
  };

  return Object.keys(obj)
    .map(function (key) { return buildQuery(key, obj[key]); })
    .join('&');
}
