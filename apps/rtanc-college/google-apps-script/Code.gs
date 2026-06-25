/**
 * Backend for วิทยาลัยพยาบาลทหารอากาศ Website
 * Google Apps Script + Google Sheet
 */
const APP_NAME = 'RTAFNC Website Backend';
const SHEETS = {
  news: 'news',
  contacts: 'contacts',
  admissions: 'admissions',
  logs: 'logs'
};

function doGet(e) {
  setup_();
  return json_({ ok: true, app: APP_NAME, time: new Date().toISOString() });
}

function doPost(e) {
  setup_();
  try {
    const body = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');
    const type = String(body.type || 'logs');
    const payload = body.payload || {};
    const safeType = SHEETS[type] ? type : 'logs';
    append_(safeType, payload, type);
    return json_({ ok: true, type: safeType, time: new Date().toISOString() });
  } catch (err) {
    append_('logs', { error: String(err) }, 'error');
    return json_({ ok: false, error: String(err) });
  }
}

function setup_() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach(k => {
    let sh = ss.getSheetByName(SHEETS[k]);
    if (!sh) sh = ss.insertSheet(SHEETS[k]);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['timestamp','type','name','email','phone','subject','title','category','message','description','note','raw_json']);
      sh.setFrozenRows(1);
    }
  });
}

function append_(sheetKey, payload, originalType) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS[sheetKey]);
  sh.appendRow([
    new Date(),
    originalType || sheetKey,
    payload.name || '',
    payload.email || '',
    payload.phone || '',
    payload.subject || '',
    payload.title || '',
    payload.cat || payload.category || '',
    payload.message || '',
    payload.desc || payload.description || '',
    payload.note || '',
    JSON.stringify(payload)
  ]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
