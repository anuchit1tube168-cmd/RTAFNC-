const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

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
    vary: "Origin",
  };
}

async function readConfig(env, keys) {
  const placeholders = keys.map(() => "?").join(",");
  const result = await env.DB.prepare(
    `SELECT key, value FROM system_config WHERE key IN (${placeholders})`,
  )
    .bind(...keys)
    .all();
  return Object.fromEntries((result.results || []).map((row) => [row.key, row.value]));
}

async function healthz(env) {
  try {
    await env.DB.prepare("SELECT 1 AS ok").first();
    const config = await readConfig(env, [
      "environment",
      "production_write",
      "production_write_enabled",
      "source_policy",
      "identity_business_key",
      "staff_login_enabled",
      "advisor_auth_enabled",
      "health_migration_enabled",
    ]);

    const dbWriteOff =
      config.production_write === "false" &&
      config.production_write_enabled === "false";
    const envWriteOff = env.PRODUCTION_WRITE !== "true";
    const safe = dbWriteOff && envWriteOff;

    return {
      ok: safe,
      service: "rtafnc-campus-core-read",
      environment: config.environment || env.ENVIRONMENT || "unknown",
      database: "reachable",
      write_gate: safe ? "OFF" : "UNSAFE",
      source_policy: config.source_policy || "unknown",
      identity_business_key: config.identity_business_key || "unknown",
      staff_login_enabled: config.staff_login_enabled === "true",
      advisor_auth_enabled: config.advisor_auth_enabled === "true",
      health_migration_enabled: config.health_migration_enabled === "true",
    };
  } catch {
    return {
      ok: false,
      service: "rtafnc-campus-core-read",
      environment: env.ENVIRONMENT || "unknown",
      database: "unreachable",
      write_gate: "FAIL_CLOSED",
    };
  }
}

async function sourceStatus(env) {
  const result = await env.DB.prepare(`
    SELECT source_key, domain, provider, access_mode, sensitivity, status, last_verified_at
    FROM source_registry
    ORDER BY domain, source_key
  `).all();
  return result.results || [];
}

async function coreSummary(env) {
  const [studentTotal, studentsByYear, staffTotal, advisorGroups, advisorReady] =
    await Promise.all([
      env.DB.prepare(
        "SELECT COUNT(*) AS count FROM student_core_staging WHERE status = 'ACTIVE'",
      ).first(),
      env.DB.prepare(`
        SELECT year_level, COUNT(*) AS count
        FROM student_core_staging
        WHERE status = 'ACTIVE'
        GROUP BY year_level
        ORDER BY year_level
      `).all(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM staff_core_staging").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM advisor_group_assignments_staging").first(),
      env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM advisor_group_assignments_staging
        WHERE staff_binding_status NOT LIKE 'PENDING%'
      `).first(),
    ]);

  return {
    students_active: Number(studentTotal?.count || 0),
    students_by_year: Object.fromEntries(
      (studentsByYear.results || []).map((row) => [
        String(row.year_level),
        Number(row.count || 0),
      ]),
    ),
    staff_staged: Number(staffTotal?.count || 0),
    advisor_group_mappings: Number(advisorGroups?.count || 0),
    advisor_staff_bindings_ready: Number(advisorReady?.count || 0),
    contains_operational_pii: false,
  };
}

async function goodDeedSummary(env) {
  const row = await env.DB.prepare(`
    SELECT deed_count, distinct_students, approved_count, rejected_count, total_hours,
           duplicate_deed_ids, missing_student_ids, invalid_student_ids,
           active_roster_match_count, names_copied, descriptions_copied,
           approvers_copied, locations_copied, images_copied, updated_at
    FROM good_deed_source_profile
    ORDER BY updated_at DESC
    LIMIT 1
  `).first();

  if (!row) return null;
  return {
    deeds: Number(row.deed_count || 0),
    distinct_students: Number(row.distinct_students || 0),
    approved: Number(row.approved_count || 0),
    rejected: Number(row.rejected_count || 0),
    total_hours: Number(row.total_hours || 0),
    data_quality: {
      duplicate_deed_ids: Number(row.duplicate_deed_ids || 0),
      missing_student_ids: Number(row.missing_student_ids || 0),
      invalid_student_ids: Number(row.invalid_student_ids || 0),
      active_roster_match_count: Number(row.active_roster_match_count || 0),
    },
    privacy_projection: {
      names_copied: Number(row.names_copied || 0),
      descriptions_copied: Number(row.descriptions_copied || 0),
      approvers_copied: Number(row.approvers_copied || 0),
      locations_copied: Number(row.locations_copied || 0),
      images_copied: Number(row.images_copied || 0),
    },
    updated_at: row.updated_at || null,
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
          message: "This UAT service is read-only.",
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

    if (url.pathname === "/api/v1/good-deed/summary") {
      try {
        const summary = await goodDeedSummary(env);
        return summary
          ? responseJson({ ok: true, summary }, 200, cors)
          : responseJson({ ok: false, error: "not_ready" }, 404, cors);
      } catch {
        return responseJson({ ok: false, error: "database_query_failed" }, 503, cors);
      }
    }

    return responseJson({ ok: false, error: "not_found" }, 404, cors);
  },
};
