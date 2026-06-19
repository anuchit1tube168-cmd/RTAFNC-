# Skill: LINE Identity Verification

## หน้าที่
ตรวจสอบข้อมูลยืนยันจาก LINE ฝั่ง Server ก่อนอนุญาตให้เข้าถึงข้อมูลสมาชิก

## Inputs
- LINE ID token
- Supabase session
- LINE channel ID จาก Server Secret

## ขั้นตอน
1. รับคำขอจาก LIFF Shell
2. ตรวจ Supabase session
3. ส่ง ID token ไปตรวจสอบกับ LINE
4. ตรวจ audience ให้ตรงกับ channel ID
5. อ่านค่า LINE user ID ที่ผ่านการตรวจแล้ว
6. ส่งต่อไปยัง Member Linking

## ข้อห้าม
- ห้ามเชื่อข้อมูลจากหน้าเว็บโดยตรง
- ห้ามบันทึก token ลง Log
- ห้ามส่ง channel secret กลับไป Browser

## Output
- verified LINE user ID
- display name สำหรับแสดงผล
- verification timestamp
