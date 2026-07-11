const AGIS_PROCESSOR_URL = 'https://script.google.com/macros/s/AKfycbwKPBvaVHYUs7tJgrDNISeFUTEZnchy083BjZ9PrUd_XQyvS10GqkoYRnRREpJESqWlDQ/exec';

async function agisProcessorGet() {
  const response = await fetch(AGIS_PROCESSOR_URL, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store'
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { ok: false, raw: text }; }
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  return data;
}

async function agisProcessorPost(action, payload = {}) {
  const response = await fetch(AGIS_PROCESSOR_URL, {
    method: 'POST',
    redirect: 'follow',
    cache: 'no-store',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { ok: false, raw: text }; }
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  return data;
}

window.AGISSProcessor = {
  url: AGIS_PROCESSOR_URL,
  health: agisProcessorGet,
  call: agisProcessorPost
};
