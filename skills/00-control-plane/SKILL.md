# Skill: RTAFNC Control Plane

## เป้าหมาย
รับคำขอจากผู้ใช้หรือเหตุการณ์ระบบ แล้วส่งต่อไปยังสกิลที่รับผิดชอบโดยไม่รวมตรรกะทุกอย่างไว้จุดเดียว

## Inputs
- actor identity
- requested action
- module
- reference id
- sensitivity level
- current session and role

## Routing
- เปิดระบบหรือ Login → `01-liff-shell`, `02-line-identity`, `03-member-linking`
- สิทธิ์ข้อมูล → `04-supabase-session-rls`
- ความดี → `05-good-deeds`
- โรงพยาบาล → `06-hospital`
- ไฟล์ → `07-private-storage`
- แจ้งเตือน → `08-notification-hub`
- ตรวจอนุมัติ → `09-admin-review`
- รายงาน → `10-report-export`
- Deploy → `11-deployment`
- ตรวจระบบ → `12-security-qa`
- เหตุผิดปกติ → `13-incident-response`

## Guardrails
1. ตรวจ Session ก่อนทุกคำขอข้อมูลส่วนบุคคล
2. ใช้ student UUID ภายใน ห้ามใช้ชื่อเป็นกุญแจหลัก
3. ข้อมูลสุขภาพใช้ระดับความลับสูงสุด
4. ห้ามส่ง Secret ไป Browser
5. การเปลี่ยนสถานะต้องบันทึก Audit Log

## Output Contract
```json
{
  "ok": true,
  "route": "skill-name",
  "reference_id": "uuid",
  "next_action": "string"
}
```
