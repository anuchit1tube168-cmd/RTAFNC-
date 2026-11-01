const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function responseJson(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  if (!origin || !env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "vary": "Origin",
  };
}

async function healthz(env) {
  try {
    await env.DB.prepare("SELECT 1 AS ok").first();
    return {
      ok: true,
      service: "rtafnc-campus-api",
      environment: env.ENVIRONMENT || "unknown",
      database: "reachable",
      production_write: env.PRODUCTION_WRITE === "true",
    };
  } catch {
    return {
      ok: false,
      service: "rtafnc-campus-api",
      environment: env.ENVIRONMENT || "unknown",
      database: "unreachable",
      production_write: env.PRODUCTION_WRITE === "true",
    };
  }
}

async function sourceStatus(env) {
  const result = await env.DB.prepare(`
    SELECT source_key, domain, provider, source_title, source_mode, sensitivity,
           authoritative, production_write_enabled, last_verified_at, notes
    FROM source_registry
    ORDER BY domain, source_key
  `).all();

  return (result.results || []).map((row) => ({
    ...row,
    authoritative: Boolean(row.authoritative),
    production_write_enabled: Boolean(row.production_write_enabled),
  }));
}

async function coreSummary(env) {
  const [studentRow, staffRow, advisorRow] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM core_students WHERE status = 'ACTIVE'").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM core_staff WHERE status = 'ACTIVE'").first(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM advisor_bindings WHERE status = 'ACTIVE'").first(),
  ]);

  return {
    students_active: Number(studentRow?.count || 0),
    staff_active: Number(staffRow?.count || 0),
    advisor_bindings_active: Number(advisorRow?.count || 0),
    contains_operational_pii: false,
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return responseJson(
        {
          ok: false,
          error: "production_write_off",
          message: "No write endpoint is enabled for this staging service.",
        },
        403,
        cors,
      );
    }

    if (url.pathname === "/healthz") {
      const status = await healthz(env);
      return responseJson(status, status.ok ? 200 : 503, cors);
    }

    if (url.pathname === "/api/v1/sources") {
      if (env.EXPOSE_SOURCE_STATUS !== "true") {
        return responseJson({ ok: false, error: "not_found" }, 404, cors);
      }
      try {
        return responseJson({ ok: true, sources: await sourceStatus(env) }, 200, cors);
      } catch {
        return responseJson({ ok: false, error: "database_query_failed" }, 503, cors);
      }
    }

    if (url.pathname === "/api/v1/core/summary") {
      try {
        return responseJson({ ok: true, summary: await coreSummary(env) }, 200, cors);
      } catch {
        return responseJson({ ok: false, error: "database_query_failed" }, 503, cors);
      }
    }

    return responseJson({ ok: false, error: "not_found" }, 404, cors);
  },
};
