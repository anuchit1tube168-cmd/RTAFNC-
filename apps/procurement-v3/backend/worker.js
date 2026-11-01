export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': env.ALLOWED_ORIGIN || 'https://anuchit1tube168-cmd.github.io',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type,authorization'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (url.pathname === '/healthz') {
      return new Response(JSON.stringify({ ok:true, service:'rtafnc-procurement-v3', gasConfigured:!!env.GAS_URL, productionWrite:false }), { headers });
    }
    if (!env.GAS_URL || !env.GATEWAY_SECRET) {
      return new Response(JSON.stringify({ ok:false, error:'backend_not_configured' }), { status:503, headers });
    }
    if (request.method === 'GET' && url.pathname === '/api/procurements') {
      const gas = new URL(env.GAS_URL);
      gas.searchParams.set('action','list');
      gas.searchParams.set('sheet','Procurements');
      gas.searchParams.set('gatewaySecret', env.GATEWAY_SECRET);
      const upstream = await fetch(gas.toString(), { redirect:'follow' });
      return new Response(await upstream.text(), { status:upstream.status, headers });
    }
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ ok:false, error:'production_write_disabled' }), { status:403, headers });
    }
    return new Response(JSON.stringify({ ok:false, error:'not_found' }), { status:404, headers });
  }
};
