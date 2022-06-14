export function UpdateQueryString(key: string, value: string) {
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  if (value) params[key] = value;
  else if (params[key]) delete params[key];

  const query_parts = [];
  for (const key in params) {
    if (!params.hasOwnProperty(key)) continue;
    const value = params[key];

    query_parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }

  window.location.href = window.location.pathname + "?" + query_parts.join("&");
}
