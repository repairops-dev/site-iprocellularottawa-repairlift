// iPro Cellular Ottawa - forwards the buyback form to the RepairOps lead system from the
// server side, so visitors' browsers only ever talk to the site's own domain.
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  var body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  res.setHeader('Content-Type', 'application/json');
  if (!body || typeof body !== 'object' || !body.public_form_key || !body.fields) { res.statusCode = 400; return res.end('{"ok":false,"error":"bad_request"}'); }
  try {
    var r = await fetch('https://crd.findloc.shop/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var text = await r.text();
    res.statusCode = r.status;
    return res.end(text || '{}');
  } catch (e) {
    res.statusCode = 502;
    return res.end('{"ok":false,"error":"upstream_unreachable"}');
  }
};
