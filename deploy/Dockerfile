FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/40-rtafnc-runtime-config.sh /docker-entrypoint.d/40-rtafnc-runtime-config.sh
COPY portal /usr/share/nginx/html/
COPY apps/liff /usr/share/nginx/html/liff/
COPY apps/admin /usr/share/nginx/html/admin/

RUN rm -f /usr/share/nginx/html/liff/config.example.js \
    && chmod +x /docker-entrypoint.d/40-rtafnc-runtime-config.sh \
    && addgroup -S rtafnc \
    && adduser -S -G rtafnc rtafnc \
    && chown -R rtafnc:rtafnc /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
