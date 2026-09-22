// NoSQL injection protection for Express 5.
// express-mongo-sanitize v2 mutates the read-only `req.query` getter on
// Express 5 and crashes, so this lightweight middleware strips `$` / `.`
// prefixed keys from body, params and query instead.
function cleanse(value) {
  if (Array.isArray(value)) return value.map(cleanse);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      out[key] = cleanse(val);
    }
    return out;
  }
  return value;
}

export function sanitize(req, _res, next) {
  if (req.body) req.body = cleanse(req.body);
  if (req.params) req.params = cleanse(req.params);
  next();
}

export default sanitize;
