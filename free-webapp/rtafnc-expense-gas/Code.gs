const APP = {
  name: 'RTAFNC Expense Tracker',
  orgName: 'วิทยาลัยพยาบาลทหารอากาศ',
  propertySpreadsheetId: 'RTAFNC_EXPENSE_SPREADSHEET_ID',
  propertyEvidenceFolderId: 'RTAFNC_EXPENSE_EVIDENCE_FOLDER_ID',
  evidenceMaxBytes: 5 * 1024 * 1024,
  evidencePublicLink: false,
  sheets: {
    users: 'Users',
    transactions: 'Transactions',
    settings: 'Settings',
    auditLogs: 'AuditLogs'
  },
  headers: {
    Users: ['email', 'displayName', 'role', 'department', 'active', 'createdAt', 'updatedAt'],
    Transactions: ['id', 'type', 'category', 'amount', 'date', 'note', 'evidenceName', 'evidenceUrl', 'status', 'createdByEmail', 'approvedByEmail', 'createdAt', 'updatedAt'],
    Settings: ['key', 'value'],
    AuditLogs: ['timestamp', 'action', 'targetSheet', 'targetId', 'actorEmail', 'detail']
  },
  defaultCategories: ['อาหาร/เครื่องดื่ม', 'การเดินทาง/พาหนะ', 'วัสดุสำนักงาน', 'งานกิจการนักเรียน', 'ฝึก/อบรม', 'รายรับอื่น ๆ']
};

function doGet() {
  ensureSetup_();
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP.name)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function api(request) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    ensureSetup_();
    const user = getCurrentUser_();
    const action = request && request.action;
    const payload = request && request.payload ? request.payload : {};

    if (action === 'bootstrap') return bootstrap_(user);
    if (action === 'createTransaction') return createTransaction_(payload, user);
    if (action === 'approveTransaction') return approveTransaction_(payload, user);
    if (action === 'deleteTransaction') return deleteTransaction_(payload, user);
    if (action === 'saveSettings') return saveSettings_(payload, user);
    if (action === 'refresh') return bootstrap_(user);

    throw new Error('ไม่รู้จักคำสั่ง: ' + action);
  } catch (error) {
    return { ok: false, message: error.message || String(error) };
  } finally {
    lock.releaseLock();
  }
}

function bootstrap_(user) {
  const profile = ensureUser_(user.email, user.name);
  requireActive_(profile);
  const settings = getSettings_();
  const rows = listTransactions_(profile);
  return { ok: true, user: profile, settings, rows };
}

function createTransaction_(payload, user) {
  const profile = ensureUser_(user.email, user.name);
  requireActive_(profile);
  if (profile.role === 'viewer') throw new Error('viewer บันทึกรายการไม่ได้');

  const type = String(payload.type || '').trim();
  if (!['income', 'expense'].includes(type)) throw new Error('ประเภทข้อมูลไม่ถูกต้อง');

  const amount = Number(payload.amount || 0);
  if (!amount || amount < 0) throw new Error('จำนวนเงินต้องมากกว่า 0');

  const now = new Date();
  const id = Utilities.getUuid();
  const evidence = payload.evidence ? saveEvidence_(payload.evidence, id, profile.email) : { name: '', url: '' };

  const row = {
    id,
    type,
    category: String(payload.category || '').trim(),
    amount,
    date: String(payload.date || Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd')),
    note: String(payload.note || '').trim(),
    evidenceName: evidence.name,
    evidenceUrl: evidence.url,
    status: profile.role === 'admin' ? 'approved' : 'pending',
    createdByEmail: profile.email,
    approvedByEmail: profile.role === 'admin' ? profile.email : '',
    createdAt: now,
    updatedAt: now
  };
  appendObject_(sheet_(APP.sheets.transactions), APP.headers.Transactions, row);
  audit_('createTransaction', APP.sheets.transactions, id, profile.email, row.status + (evidence.url ? ' with evidence' : ''));
  return bootstrap_(user);
}

function approveTransaction_(payload, user) {
  const profile = ensureUser_(user.email, user.name);
  requireAdmin_(profile);
  const id = String(payload.id || '');
  const status = String(payload.status || '');
  if (!['approved', 'rejected'].includes(status)) throw new Error('สถานะอนุมัติไม่ถูกต้อง');

  const sh = sheet_(APP.sheets.transactions);
  const data = readObjects_(sh);
  const index = data.findIndex(item => item.id === id);
  if (index < 0) throw new Error('ไม่พบรายการ');

  const rowNumber = index + 2;
  setByHeader_(sh, rowNumber, 'status', status);
  setByHeader_(sh, rowNumber, 'approvedByEmail', profile.email);
  setByHeader_(sh, rowNumber, 'updatedAt', new Date());
  audit_('approveTransaction', APP.sheets.transactions, id, profile.email, status);
  return bootstrap_(user);
}

function deleteTransaction_(payload, user) {
  const profile = ensureUser_(user.email, user.name);
  requireAdmin_(profile);
  const id = String(payload.id || '');
  const sh = sheet_(APP.sheets.transactions);
  const data = readObjects_(sh);
  const index = data.findIndex(item => item.id === id);
  if (index < 0) throw new Error('ไม่พบรายการ');
  sh.deleteRow(index + 2);
  audit_('deleteTransaction', APP.sheets.transactions, id, profile.email, 'row deleted; evidence file not deleted');
  return bootstrap_(user);
}

function saveSettings_(payload, user) {
  const profile = ensureUser_(user.email, user.name);
  requireAdmin_(profile);
  const next = {
    organizationName: String(payload.organizationName || APP.orgName).trim(),
    fiscalYear: String(payload.fiscalYear || (new Date().getFullYear() + 543)).trim(),
    categories: Array.isArray(payload.categories) ? payload.categories.filter(Boolean).join('\n') : APP.defaultCategories.join('\n')
  };
  writeSettings_(next);
  audit_('saveSettings', APP.sheets.settings, 'app', profile.email, JSON.stringify(next));
  return bootstrap_(user);
}

function listTransactions_(profile) {
  const rows = readObjects_(sheet_(APP.sheets.transactions));
  const visible = profile.role === 'staff'
    ? rows.filter(row => row.createdByEmail === profile.email)
    : rows;
  return visible
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 300);
}

function saveEvidence_(evidence, transactionId, actorEmail) {
  if (!evidence || !evidence.dataUrl) return { name: '', url: '' };
  const rawName = sanitizeFilename_(evidence.name || 'evidence');
  const dataUrl = String(evidence.dataUrl || '');
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('รูปแบบไฟล์หลักฐานไม่ถูกต้อง');

  const contentType = match[1];
  const base64 = match[2];
  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > APP.evidenceMaxBytes) throw new Error('ไฟล์หลักฐานต้องไม่เกิน 5MB');

  const safeActor = sanitizeFilename_(actorEmail || 'user');
  const fileName = transactionId + '_' + safeActor + '_' + rawName;
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  const folder = evidenceFolder_();
  const file = folder.createFile(blob);

  if (APP.evidencePublicLink) {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  return { name: rawName, url: file.getUrl() };
}

function evidenceFolder_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(APP.propertyEvidenceFolderId);
  if (id) return DriveApp.getFolderById(id);

  const parent = DriveApp.getFileById(spreadsheet_().getId()).getParents().hasNext()
    ? DriveApp.getFileById(spreadsheet_().getId()).getParents().next()
    : DriveApp.getRootFolder();
  const folder = parent.createFolder(APP.name + ' Evidence');
  props.setProperty(APP.propertyEvidenceFolderId, folder.getId());
  return folder;
}

function sanitizeFilename_(value) {
  return String(value || '')
    .replace(/[\\/:*?"<>|#%{}~&]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 120) || 'file';
}

function ensureSetup_() {
  const ss = spreadsheet_();
  Object.keys(APP.headers).forEach(name => ensureSheet_(ss, name, APP.headers[name]));
  const settings = getSettings_();
  if (!settings.organizationName) {
    writeSettings_({
      organizationName: APP.orgName,
      fiscalYear: String(new Date().getFullYear() + 543),
      categories: APP.defaultCategories.join('\n')
    });
  }
}

function spreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(APP.propertySpreadsheetId);
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create(APP.name + ' Database');
  props.setProperty(APP.propertySpreadsheetId, ss.getId());
  return ss;
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    return sh;
  }

  const currentHeaders = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(String);
  const missing = headers.filter(header => currentHeaders.indexOf(header) === -1);
  if (missing.length) {
    sh.getRange(1, currentHeaders.length + 1, 1, missing.length).setValues([missing]);
  }
  return sh;
}

function sheet_(name) {
  return spreadsheet_().getSheetByName(name);
}

function getCurrentUser_() {
  const email = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  if (!email) throw new Error('ไม่พบอีเมลผู้ใช้ ให้ Deploy เป็น Web app แบบต้อง login ด้วย Google ก่อน');
  return { email, name: email.split('@')[0] };
}

function ensureUser_(email, name) {
  const sh = sheet_(APP.sheets.users);
  const rows = readObjects_(sh);
  let found = rows.find(row => String(row.email).toLowerCase() === String(email).toLowerCase());
  if (found) return normalizeUser_(found);

  const role = rows.length === 0 ? 'admin' : 'staff';
  const now = new Date();
  found = {
    email,
    displayName: name || email,
    role,
    department: '',
    active: true,
    createdAt: now,
    updatedAt: now
  };
  appendObject_(sh, APP.headers.Users, found);
  audit_('createUser', APP.sheets.users, email, email, role);
  return normalizeUser_(found);
}

function normalizeUser_(user) {
  return {
    email: String(user.email || '').trim(),
    displayName: String(user.displayName || user.email || '').trim(),
    role: String(user.role || 'staff').trim(),
    department: String(user.department || '').trim(),
    active: String(user.active).toLowerCase() !== 'false'
  };
}

function requireActive_(profile) {
  if (!profile.active) throw new Error('บัญชีนี้ถูกปิดการใช้งาน');
}

function requireAdmin_(profile) {
  requireActive_(profile);
  if (profile.role !== 'admin') throw new Error('เฉพาะ admin เท่านั้น');
}

function getSettings_() {
  const rows = readObjects_(sheet_(APP.sheets.settings));
  const map = {};
  rows.forEach(row => map[row.key] = row.value);
  return {
    organizationName: map.organizationName || APP.orgName,
    fiscalYear: map.fiscalYear || String(new Date().getFullYear() + 543),
    categories: String(map.categories || APP.defaultCategories.join('\n')).split('\n').map(x => x.trim()).filter(Boolean)
  };
}

function writeSettings_(settings) {
  const sh = sheet_(APP.sheets.settings);
  sh.clearContents();
  sh.getRange(1, 1, 1, APP.headers.Settings.length).setValues([APP.headers.Settings]);
  const values = Object.keys(settings).map(key => [key, settings[key]]);
  if (values.length) sh.getRange(2, 1, values.length, 2).setValues(values);
}

function readObjects_(sh) {
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(row => row.some(cell => cell !== '')).map(row => {
    const obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
}

function appendObject_(sh, headers, obj) {
  ensureSheet_(spreadsheet_(), sh.getName(), headers);
  const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  sh.appendRow(currentHeaders.map(header => obj[header] === undefined ? '' : obj[header]));
}

function setByHeader_(sh, rowNumber, headerName, value) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  const column = headers.indexOf(headerName) + 1;
  if (column < 1) throw new Error('ไม่พบ column: ' + headerName);
  sh.getRange(rowNumber, column).setValue(value);
}

function audit_(action, targetSheet, targetId, actorEmail, detail) {
  const sh = spreadsheet_().getSheetByName(APP.sheets.auditLogs);
  if (!sh) return;
  sh.appendRow([new Date(), action, targetSheet, targetId, actorEmail, detail || '']);
}
