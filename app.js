// Verbindung zu Supabase. Der Schlüssel ist öffentlich; geschützt wird über RLS + Funktionen.
window.QUIZ_CONFIG = {
  url: 'https://asarpwloprxoaysdtpwt.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYXJwd2xvcHJ4b2F5c2R0cHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMzkzOTIsImV4cCI6MjA5MTkxNTM5Mn0.sqyOaX58rnSG9nHEPkJx99KAUEGsrNNhivDJSkj_suM'
};

async function rpc(fn, args) {
  const c = window.QUIZ_CONFIG;
  const headers = { 'Content-Type': 'application/json', apikey: c.key };
  if (c.key.startsWith('eyJ')) headers.Authorization = 'Bearer ' + c.key;
  let res;
  try {
    res = await fetch(c.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers, body: JSON.stringify(args || {}) });
  } catch (e) {
    throw new Error('Keine Verbindung. Bitte Netz prüfen und erneut versuchen.');
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { /* kein JSON */ }
  if (!res.ok) throw new Error((data && data.message) || ('Fehler ' + res.status));
  return data;
}

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* privat */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* privat */ } }
};

function fmtTime(ms) {
  if (ms == null || ms < 0) ms = 0;
  const total = ms / 1000;
  const m = Math.floor(total / 60);
  const s = (total - m * 60).toFixed(1).padStart(4, '0').replace('.', ',');
  return m + ':' + s;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
