const ALLOWED_ORIGINS = new Set(['https://anuchit1tube168-cmd.github.io']);

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://anuchit1tube168-cmd.github.io';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(request, data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'no-referrer',
      ...corsHeaders(request),
      ...extra,
    },
  });
}

async function readJson(kv, key, fallback) {
  const raw = await kv.get(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }
      if (url.pathname === '/healthz' && request.method === 'GET') {
        const meta = await readJson(env.DATA, 'meta', null);
        return json(request, {
          ok: true,
          service: 'rtafnc-procurement-v3-api',
          storage: 'workers-kv',
          source: 'google-sheets-mirror',
          production_write: false,
          last_synced_at: meta?.last_synced_at || null,
        });
      }
      if (url.pathname === '/api/v1/snapshot' && request.method === 'GET') {
        const [meta, procurements, committees, assets, inventory] = await Promise.all([
          readJson(env.DATA, 'meta', {}),
          readJson(env.DATA, 'procurements', []),
          readJson(env.DATA, 'committees', []),
          readJson(env.DATA, 'assets', []),
          readJson(env.DATA, 'inventory', []),
        ]);
        return json(request, {
          meta: {
            project: meta.project || 'RTAFNC-Procurement-v3',
            schema_version: meta.schema_version || '1.0.0',
            source: 'google-sheets-mirror',
            production_write: false,
            last_synced_at: meta.last_synced_at || null,
          },
          procurements,
          committees,
          assets,
          inventory,
        });
      }
      if (url.pathname === '/api/v1/procurements' && request.method === 'GET') {
        const procurements = await readJson(env.DATA, 'procurements', []);
        return json(request, { data: procurements, count: procurements.length, production_write: false });
      }
      if (url.pathname.startsWith('/api/v1/') && request.method !== 'GET') {
        return json(request, {
          ok: false,
          error: 'PRODUCTION_WRITE_DISABLED',
          message: 'Write operations are disabled until RBAC/UAT is approved.'
        }, 403);
      }
      return json(request, { ok: false, error: 'NOT_FOUND' }, 404);
    } catch (error) {
      console.error(JSON.stringify({ event: 'request_error', message: error?.message || String(error) }));
      return json(request, { ok: false, error: 'INTERNAL_ERROR' }, 500);
    }
  },
};
