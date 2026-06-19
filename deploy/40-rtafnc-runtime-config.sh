#!/bin/sh
set -eu

escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\r//g; s/\n/\\n/g'
}

SUPABASE_URL_ESCAPED="$(escape_js "${SUPABASE_URL:-}")"
SUPABASE_KEY_ESCAPED="$(escape_js "${SUPABASE_PUBLISHABLE_KEY:-}")"
LIFF_ID_ESCAPED="$(escape_js "${LIFF_ID:-}")"
LINE_OA_ID_ESCAPED="$(escape_js "${LINE_OA_ID:-}")"
DEMO_MODE_VALUE="${DEMO_MODE:-true}"
DEFAULT_SEMESTER_VALUE="${DEFAULT_SEMESTER:-1}"

case "$DEMO_MODE_VALUE" in
  true|false) ;;
  *) DEMO_MODE_VALUE=true ;;
esac

case "$DEFAULT_SEMESTER_VALUE" in
  1|2|3) ;;
  *) DEFAULT_SEMESTER_VALUE=1 ;;
esac

cat > /usr/share/nginx/html/liff/config.js <<EOF
window.RTAFNC_CONFIG = Object.freeze({
  supabaseUrl: "${SUPABASE_URL_ESCAPED}",
  supabasePublishableKey: "${SUPABASE_KEY_ESCAPED}",
  liffId: "${LIFF_ID_ESCAPED}",
  lineOaId: "${LINE_OA_ID_ESCAPED}",
  defaultSemester: ${DEFAULT_SEMESTER_VALUE},
  demoMode: ${DEMO_MODE_VALUE}
});
EOF

cat > /usr/share/nginx/html/admin/config.js <<EOF
window.RTAFNC_ADMIN_CONFIG = Object.freeze({
  supabaseUrl: "${SUPABASE_URL_ESCAPED}",
  supabasePublishableKey: "${SUPABASE_KEY_ESCAPED}",
  demoMode: ${DEMO_MODE_VALUE}
});
EOF

printf 'RTAFNC runtime config generated. demoMode=%s\n' "$DEMO_MODE_VALUE"
