# เปิด RTAFNC Dashboard จาก GitHub

## วิธีเร็วที่สุด: GitHub Codespaces

1. เปิด Repository `anuchit1tube168-cmd/RTAFNC-`
2. กดปุ่ม `Code`
3. เลือกแท็บ `Codespaces`
4. กด `Create codespace on main`
5. รอระบบเตรียม Environment
6. Port `5500` จะเปิดอัตโนมัติใน Browser

หน้าใช้งาน:

- Portal: `/`
- Student LIFF Preview: `/liff/`
- Staff Dashboard: `/admin/`
- Health Check: `/healthz`

## เปิดจาก Terminal

```bash
python3 tools/preview_server.py --port 5500
```

แล้วเปิด:

```text
http://localhost:5500/
http://localhost:5500/liff/
http://localhost:5500/admin/
```

## เปิดด้วย Docker

```bash
docker compose up --build -d
```

แล้วเปิด:

```text
http://localhost:8080/
http://localhost:8080/liff/
http://localhost:8080/admin/
```

## ข้อควรรู้

- Codespaces และ Local Preview ใช้โหมดสาธิต
- ข้อมูลตัวอย่างอยู่ใน Browser localStorage
- ยังไม่ใช่ LIFF Production จนกว่าจะตั้ง HTTPS URL, LIFF ID และ Supabase
- Repository ยังคงเป็น Private
