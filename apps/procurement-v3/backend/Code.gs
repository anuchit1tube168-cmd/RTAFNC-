const DB_ID = '13LwwCOF5gjKZQMQuDeiG31jnWQoPCYUO56rN5i3S7nw';
const ALLOWED_SHEETS = new Set(['Settings','Users','Plans','Procurements','TOR','Vendors','Contracts','Receipts','Assets','Inventory','Committees','Documents','AuditLog']);

function json_(payload, code) {
  return ContentService.createTextOutput(JSON.stringify({ code: code || 200, ...payload }))
    .setMimeType(ContentService.MimeType.JSON);
}

function props_() { return PropertiesService.getScriptProperties(); }
function writeEnabled_() { return String(props_().getProperty('PRODUCTION_WRITE') || 'false').toLowerCase() === 'true'; }
function auth_(secret) {
  const expected = props_().getProperty('GATEWAY_SECRET');
  return !!expected && !!secret && secret === expected;
}

function rowsAsObjects_(sheetName) {
  if (!ALLOWED_SHEETS.has(sheetName)) throw new Error('sheet_not_allowed');
  const sh = SpreadsheetApp.openById(DB_ID).getSheetByName(sheetName);
  if (!sh) throw new Error('sheet_not_found');
  const values = sh.getDataRange().getValues();
  if (!values.length) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(r => r.some(v => v !== '')).map(r => {
    const o = {}; headers.forEach((h,i) => o[h] = r[i]); return o;
  });
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'health');
    if (action === 'health') {
      return json_({ ok:true, service:'rtafnc-procurement-v3-gas', database:'google-sheets', writeEnabled:writeEnabled_(), schemaVersion:'1.0.0' });
    }
    if (!auth_(e.parameter.gatewaySecret)) return json_({ ok:false, error:'unauthorized' }, 401);
    if (action === 'list') {
      const sheet = String(e.parameter.sheet || 'Procurements');
      return json_({ ok:true, sheet, rows:rowsAsObjects_(sheet) });
    }
    return json_({ ok:false, error:'unsupported_action' }, 400);
  } catch (err) {
    return json_({ ok:false, error:String(err && err.message || err) }, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!auth_(body.gatewaySecret)) return json_({ ok:false, error:'unauthorized' }, 401);
    if (!writeEnabled_()) return json_({ ok:false, error:'production_write_disabled' }, 403);
    return json_({ ok:false, error:'write_routes_not_enabled_in_v1' }, 501);
  } catch (err) {
    return json_({ ok:false, error:String(err && err.message || err) }, 500);
  }
}
