#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  echo "ไม่พบไฟล์ .env"
  echo "คัดลอก .env.example เป็น .env แล้วใส่ค่าการเชื่อมต่อก่อน"
  exit 1
fi

set -a
. ./.env
set +a

if [ "${DEMO_MODE:-true}" = "false" ]; then
  missing=""
  for name in SUPABASE_URL SUPABASE_PUBLISHABLE_KEY LIFF_ID; do
    eval "value=\${$name:-}"
    if [ -z "$value" ]; then
      missing="$missing $name"
    fi
  done
  if [ -n "$missing" ]; then
    echo "Production Mode ขาดค่า:$missing"
    exit 1
  fi
fi

docker compose up --build -d

echo "รอ Health Check..."
count=0
until wget -qO- http://127.0.0.1:8080/healthz >/dev/null 2>&1; do
  count=$((count + 1))
  if [ "$count" -ge 30 ]; then
    echo "ระบบไม่พร้อมภายในเวลาที่กำหนด"
    docker compose logs --tail=100
    exit 1
  fi
  sleep 1
done

echo "RTAFNC Portal พร้อมใช้งาน"
echo "Portal: http://localhost:8080/"
echo "LIFF:   http://localhost:8080/liff/"
echo "Admin:  http://localhost:8080/admin/"
