# RTAFNC Good Deed Certificate Skill

> Skill สำหรับสร้างระบบ Web Application ของนักเรียนพยาบาลทหารอากาศ / นักเรียนทหารอากาศ เพื่อบันทึกความดี เก็บหลักฐาน ออกใบประกาศผล และสรุปรายงานให้ผู้บริหารรับรองได้ทันที

---

## 1. เป้าหมายของ Skill

สร้างระบบชื่อ **คลังบันทึกความดีและใบประกาศผล วพอ.** โดยอ้างอิงแนวคิดจากระบบคลังผลงานครู/เกียรติบัตร แต่ปรับให้เป็นงานของนักเรียนทหารอากาศ ใช้สำหรับ

- บันทึกกิจกรรมความดี / จิตอาสา / วินัย / ภาวะผู้นำ / กิจกรรมสาธารณประโยชน์
- แนบหลักฐานรูปภาพหรือ PDF พร้อมบีบอัดภาพอัตโนมัติ
- แท็กรายชื่อผู้ร่วมกิจกรรมหรือผู้รับรอง
- ค้นหาข้อมูลย้อนหลังได้รวดเร็ว
- ออกใบประกาศผลบันทึกความดีเป็น PDF / A4 Print
- Export Excel เพื่อสรุปรายงานประจำเดือน/ภาคเรียน/ปีการศึกษา
- Dashboard แยกตามชั้นปี หมวดกิจกรรม สถานะการรับรอง และคะแนน/ชั่วโมงสะสม

ระบบต้องรองรับทั้ง **GitHub Pages Prototype** และต่อยอดเชื่อม **Google Apps Script + Google Sheets + Google Drive** ได้

---

## 2. หลักการออกแบบจากภาพตัวอย่าง

ให้ยึดแนวทาง UI จากภาพตัวอย่าง 3 ส่วนนี้

### 2.1 Login Page

- Card กลางหน้าจอ ขอบมน เงานุ่ม
- Header เป็นสีแดงเลือดหมู / แดงราชการ พร้อม wave divider
- โลโก้สถานศึกษากลางด้านบน
- ช่อง Username และ Password มี icon
- ปุ่มหลักสีแดง ขอบมนเต็มความกว้าง
- มีลิงก์ลงทะเบียน / ขอสิทธิ์เข้าใช้งาน

ปรับข้อความเป็น

- หัวข้อ: `ยินดีต้อนรับ!`
- Sub text: `เข้าสู่ระบบคลังบันทึกความดีและใบประกาศผล`
- Demo account: `admin / 1234`, `student / 1234`, `advisor / 1234`

### 2.2 Add Record Modal

Modal เพิ่มข้อมูลต้องเหมือนแนวภาพตัวอย่าง แต่เปลี่ยนเนื้อหาเป็นนักเรียน

หัวข้อ Modal:

`เพิ่มข้อมูลบันทึกความดี / ใบประกาศผล`

Field สำคัญ:

1. ชื่อนักเรียน / ผู้ร่วมกิจกรรม
2. ปุ่มเพิ่มชื่อเอง และปุ่มดึงชื่อจากระบบนักเรียน
3. ประเภทกิจกรรมความดี
4. ชื่อกิจกรรม / ผลงาน / รายการแข่งขัน / ภารกิจจิตอาสา
5. วันที่ทำกิจกรรม
6. ปีการศึกษา
7. ภาคเรียน
8. ชั้นปี / รุ่น
9. หมวด / กอง / กลุ่มเรียน
10. รูปแบบกิจกรรม: Onsite / Online / Hybrid
11. ระดับกิจกรรม: วิทยาลัย / กรมแพทย์ ทอ. / ทอ. / ประเทศ / นานาชาติ
12. จำนวนชั่วโมงความดี
13. หน่วยงานที่จัด
14. สถานที่จัด
15. รายละเอียดกิจกรรม
16. อัปโหลดหลักฐาน รูปภาพ / PDF
17. ผู้รับรอง / อาจารย์ที่ปรึกษา
18. สถานะ: รอตรวจ / รับรองแล้ว / ส่งกลับแก้ไข / ไม่รับรอง

### 2.3 Feed / Dashboard Page

หน้าแรกต้องมี

- Navbar ด้านบน: โลโก้ + ชื่อระบบ + หน้าแรก + โปรไฟล์ + จัดการ + toggle dark mode + user menu
- หัวข้อใหญ่: `ความเคลื่อนไหวบันทึกความดีและใบประกาศผล`
- ปุ่ม Grid / List
- ปุ่ม `+ เพิ่มบันทึกความดี`
- Filter: ประเภท, ระดับ, ภาคเรียน, ปีการศึกษา, ค้นหาชื่อนักเรียน
- Card รายการกิจกรรมพร้อม preview หลักฐาน
- Badge ประเภทกิจกรรม / ระดับกิจกรรม / สถานะรับรอง
- แสดงวันที่, หน่วยงาน, จำนวนชั่วโมง, ชื่อผู้บันทึก, จำนวนดาว
- ปุ่มพิมพ์ใบประกาศ / แก้ไข / ลบ
- Footer อธิบายระบบ + เมนูลัด + ติดต่อผู้ดูแลระบบ

---

## 3. กลุ่มผู้ใช้และสิทธิ์

### 3.1 Admin

- เห็นข้อมูลทั้งหมด
- เพิ่ม / แก้ไข / ลบข้อมูล
- อนุมัติหรือยกเลิกการรับรอง
- จัดการนักเรียน ผู้ใช้ หมวดกิจกรรม และปีการศึกษา
- Export Excel / PDF รายงานรวม
- ตั้งค่าโลโก้ ชื่อหน่วยงาน และลายเซ็นผู้รับรอง

### 3.2 อาจารย์ที่ปรึกษา / ผู้รับรอง

- เห็นข้อมูลของนักเรียนในความรับผิดชอบ
- ตรวจหลักฐาน
- ให้ความเห็น
- รับรอง / ส่งกลับแก้ไข
- พิมพ์รายงานรายบุคคลหรือรายกลุ่ม

### 3.3 นักเรียน

- บันทึกกิจกรรมของตนเอง
- แนบหลักฐาน
- แท็กผู้ร่วมกิจกรรม
- ดูประวัติและคะแนน/ชั่วโมงสะสม
- ดาวน์โหลดใบประกาศผลของตนเองหลังรับรองแล้ว

### 3.4 ผู้บริหาร / Viewer

- ดู Dashboard ภาพรวม
- ดูรายงานที่รับรองแล้ว
- Export รายงานสรุป
- ไม่สามารถแก้ไขข้อมูลดิบได้

---

## 4. หมวดกิจกรรมความดีที่ต้องมี

ให้ระบบสร้างหมวดเริ่มต้นดังนี้

1. จิตอาสาและสาธารณประโยชน์
2. วินัยและความรับผิดชอบ
3. ภาวะผู้นำและการช่วยเหลือเพื่อน
4. คุณธรรม จริยธรรม และความซื่อสัตย์
5. กิจกรรมวิชาการ / นวัตกรรม / การแข่งขัน
6. กีฬาและสุขภาพ
7. ศิลปวัฒนธรรมและกิจกรรมสถาบัน
8. กิจกรรมด้านทหาร / ระเบียบวินัย / การฝึก
9. งานบริการสุขภาพ / การพยาบาล / ช่วยเหลือประชาชน
10. อื่น ๆ

แต่ละหมวดต้องกำหนดได้ว่า

- ใช้ชั่วโมงสะสมหรือไม่
- ต้องมีหลักฐานกี่ไฟล์ขั้นต่ำ
- ต้องมีผู้รับรองระดับใด
- นับเป็นคะแนนความดีหรือเฉพาะเก็บประวัติ

---

## 5. โครงสร้างข้อมูล

### 5.1 Sheet / Table: `Users`

| Field | Type | Description |
|---|---|---|
| userId | string | รหัสผู้ใช้ |
| username | string | ชื่อเข้าใช้งาน |
| passwordHash | string | เก็บแบบ hash เมื่อใช้จริง |
| displayName | string | ชื่อที่แสดง |
| role | enum | admin, advisor, student, viewer |
| studentId | string | รหัสนักเรียน ถ้ามี |
| department | string | ฝ่าย / แผนก |
| status | enum | active, inactive |
| createdAt | datetime | วันสร้าง |

### 5.2 Sheet / Table: `Students`

| Field | Type | Description |
|---|---|---|
| studentId | string | รหัสนักเรียน 7 หลัก |
| prefix | string | ยศ/คำนำหน้า |
| firstName | string | ชื่อ |
| lastName | string | นามสกุล |
| nickname | string | ชื่อเล่น |
| yearLevel | number | ชั้นปี |
| classNo | string | รุ่น |
| platoon | string | หมวด/กลุ่ม |
| advisorId | string | อาจารย์ที่ปรึกษา |
| phone | string | optional |
| lineId | string | optional |
| photoUrl | string | รูปโปรไฟล์ |
| active | boolean | สถานะ |

### 5.3 Sheet / Table: `GoodDeeds`

| Field | Type | Description |
|---|---|---|
| deedId | string | รหัสรายการ เช่น GD-2569-0001 |
| title | string | ชื่อกิจกรรม |
| category | string | หมวดกิจกรรม |
| studentIds | array/string | รหัสนักเรียนที่เกี่ยวข้อง |
| mainStudentId | string | ผู้รายงานหลัก |
| activityDate | date | วันที่ทำกิจกรรม |
| academicYear | string | ปีการศึกษา |
| semester | string | ภาคเรียน |
| format | enum | onsite, online, hybrid |
| level | enum | college, department, airforce, national, international |
| hours | number | จำนวนชั่วโมง |
| organizer | string | หน่วยงานที่จัด |
| location | string | สถานที่ |
| description | text | รายละเอียด |
| evidenceUrls | array/string | ลิงก์หลักฐาน |
| status | enum | draft, pending, approved, rejected, revision |
| advisorId | string | ผู้ตรวจ |
| advisorComment | text | ความเห็น |
| approvedBy | string | ผู้รับรอง |
| approvedAt | datetime | วันรับรอง |
| stars | number | จำนวนดาว |
| createdBy | string | ผู้สร้าง |
| createdAt | datetime | วันสร้าง |
| updatedAt | datetime | วันแก้ไข |

### 5.4 Sheet / Table: `Certificates`

| Field | Type | Description |
|---|---|---|
| certId | string | เลขที่ใบประกาศ |
| deedId | string | อ้างอิงรายการความดี |
| studentId | string | ผู้ได้รับใบประกาศ |
| certType | string | ประเภทใบประกาศ |
| certTitle | string | ชื่อใบประกาศ |
| issueDate | date | วันที่ออก |
| signerName | string | ผู้ลงนาม |
| signerPosition | string | ตำแหน่งผู้ลงนาม |
| qrVerifyUrl | string | ลิงก์ตรวจสอบ |
| pdfUrl | string | ไฟล์ PDF |
| status | enum | issued, cancelled |

### 5.5 Sheet / Table: `EvidenceFiles`

| Field | Type | Description |
|---|---|---|
| fileId | string | รหัสไฟล์ |
| deedId | string | อ้างอิงรายการ |
| fileName | string | ชื่อไฟล์ |
| mimeType | string | ประเภทไฟล์ |
| originalSize | number | ขนาดเดิม |
| compressedSize | number | ขนาดหลังบีบอัด |
| driveUrl | string | ลิงก์ Google Drive |
| thumbnailUrl | string | thumbnail |
| uploadedBy | string | ผู้ upload |
| uploadedAt | datetime | วัน upload |

### 5.6 Sheet / Table: `Stars`

| Field | Type | Description |
|---|---|---|
| starId | string | รหัสดาว |
| deedId | string | รายการที่กดดาว |
| userId | string | ผู้กดดาว |
| createdAt | datetime | วันกด |

### 5.7 Sheet / Table: `Settings`

| Field | Type | Description |
|---|---|---|
| key | string | ชื่อตัวแปร |
| value | string | ค่า |
| updatedAt | datetime | วันแก้ไข |

---

## 6. ฟังก์ชันหลักของระบบ

### 6.1 Authentication

Prototype GitHub Pages ใช้ mock login ได้

```js
const DEMO_USERS = [
  { username: 'admin', password: '1234', role: 'admin', displayName: 'ผู้ดูแลระบบ' },
  { username: 'advisor', password: '1234', role: 'advisor', displayName: 'อาจารย์ที่ปรึกษา' },
  { username: 'student', password: '1234', role: 'student', displayName: 'นพอ. ตัวอย่าง' }
];
```

Production ต้องใช้ Google Apps Script หรือ Firebase Auth และห้ามเก็บ password plain text

### 6.2 Add Good Deed Record

ต้องสามารถ

- เพิ่มรายการใหม่
- เลือกนักเรียนหลายคน
- Upload หลักฐานหลายไฟล์
- บีบอัดภาพก่อนเก็บ
- ตั้งสถานะเป็น `pending`
- ส่งแจ้งเตือนผู้รับรอง

### 6.3 Smart Search

ค้นหาได้จาก

- ชื่อนักเรียน
- รหัสนักเรียน
- ชื่อกิจกรรม
- หมวดกิจกรรม
- ปีการศึกษา
- ภาคเรียน
- หน่วยงานที่จัด
- สถานะการรับรอง
- ระดับกิจกรรม

ต้องทำ fuzzy search เบื้องต้น เช่น พิมพ์บางคำแล้วยังเจอ

### 6.4 Grid / List View

- Grid: เหมาะสำหรับดูหลักฐาน/รูปภาพ
- List: เหมาะสำหรับตรวจข้อมูลจำนวนมาก
- จำค่า view ล่าสุดไว้ใน localStorage

### 6.5 Star System

- ผู้ใช้กดดาวให้ผลงาน/กิจกรรมที่ชื่นชอบได้
- 1 คนกดได้ 1 ดาวต่อรายการ
- แสดงจำนวนดาวบน card
- ใช้เป็นแรงเสริมเชิงบวก ไม่ใช่คะแนนหลักอย่างเดียว

### 6.6 Profile Page

โปรไฟล์นักเรียนต้องแสดง

- รูปนักเรียน
- ชื่อ รหัส ชั้นปี รุ่น หมวด
- ชั่วโมงความดีรวม
- จำนวนกิจกรรมที่รับรองแล้ว
- หมวดที่ทำมากที่สุด
- ประวัติรายการทั้งหมด
- ปุ่มดาวน์โหลด `ใบประกาศผลบันทึกความดีรายบุคคล`

### 6.7 Certificate Generator

ใบประกาศผลต้องมี

- กระดาษ A4 แนวตั้ง
- โลโก้ วพอ. / ตราหน่วย
- ชื่อเอกสาร: `ใบประกาศผลบันทึกความดี`
- ชื่อนักเรียน
- รหัสนักเรียน / ชั้นปี / รุ่น
- ตารางสรุปกิจกรรมที่รับรองแล้ว
- ชั่วโมงรวม
- ผลการประเมินหรือระดับเกียรติคุณ
- ลายเซ็นผู้รับรอง
- QR Code สำหรับตรวจสอบเอกสาร
- เลขที่เอกสาร
- วันที่ออกเอกสาร

ระดับผลลัพธ์ตัวอย่าง

- 0–9 ชั่วโมง: อยู่ระหว่างสะสม
- 10–24 ชั่วโมง: ระดับดี
- 25–49 ชั่วโมง: ระดับดีมาก
- 50 ชั่วโมงขึ้นไป: ระดับดีเยี่ยม

### 6.8 Export

ต้อง Export ได้

- Excel รายการทั้งหมด
- Excel แยกชั้นปี
- PDF ใบประกาศผลรายบุคคล
- PDF รายงานสรุปผู้บริหาร
- PDF รายงานรอตรวจรับรอง

---

## 7. หน้าจอที่ต้องสร้าง

### 7.1 `/good-deed/index.html`

Single Page Application หลัก มี route ภายใน

- `#/login`
- `#/dashboard`
- `#/feed`
- `#/add`
- `#/profile/:studentId`
- `#/certificate/:studentId`
- `#/admin`

### 7.2 Login Screen

ต้องสวยแบบ premium military education

Design Token:

```css
:root {
  --rtafnc-red: #b9362b;
  --rtafnc-red-dark: #8f241d;
  --rtafnc-blue: #153b6f;
  --rtafnc-gold: #d6a43a;
  --surface: #ffffff;
  --background: #f4f6f8;
  --text: #20242a;
  --muted: #6b7280;
  --border: #e5e7eb;
  --radius-lg: 28px;
  --radius-md: 16px;
  --shadow-soft: 0 24px 60px rgba(15, 23, 42, 0.14);
}
```

### 7.3 Dashboard Screen

Cards ด้านบน

- รายการทั้งหมด
- รอตรวจรับรอง
- รับรองแล้ว
- ชั่วโมงความดีรวม
- นักเรียนที่มีชั่วโมงสูงสุด
- กิจกรรมเดือนนี้

Charts

- Donut chart แยกหมวดกิจกรรม
- Bar chart ชั่วโมงตามชั้นปี
- Line chart จำนวนกิจกรรมรายเดือน

### 7.4 Add/Edit Modal

ใช้ modal ขนาดใหญ่เต็มจอมือถือได้

Validation:

- ชื่อกิจกรรมห้ามว่าง
- ต้องเลือกนักเรียนอย่างน้อย 1 คน
- วันที่ต้องถูกต้อง
- ชั่วโมงต้องเป็นตัวเลข 0.5–24 ต่อรายการ
- หลักฐานต้องเป็น jpg, png, webp, pdf
- ไฟล์ภาพต้องบีบอัดก่อน upload

### 7.5 Certificate Print Page

ต้องใช้ CSS `@media print`

- ซ่อน navbar และปุ่มทั้งหมดตอนพิมพ์
- บังคับ A4
- ใช้ font TH Sarabun หรือ fallback เป็น system Thai font
- มีเส้นขอบแบบราชการสุภาพ

---

## 8. โครงสร้างโปรเจกต์ GitHub

ห้ามรวมกับโปรเจกต์อื่น ให้แยก folder ชัดเจน

```text
RTAFNC-/
  good-deed-certificate/
    index.html
    README.md
    assets/
      logo-rtafnc.png
      sample-certificate.png
    css/
      app.css
      print.css
    js/
      app.js
      data.mock.js
      auth.js
      storage.js
      search.js
      certificate.js
      image-compress.js
      export.js
    gas/
      Code.gs
      Api.gs
      DriveService.gs
      SheetService.gs
      PdfService.gs
    docs/
      system-requirement.md
      data-dictionary.md
      user-manual.md
  skills/
    rtafnc-good-deed-certificate-skill.md
```

GitHub Pages URL ที่ต้องรองรับเมื่อ deploy:

```text
https://anuchit1tube168-cmd.github.io/RTAFNC-/good-deed-certificate/
```

---

## 9. Google Apps Script Backend Specification

### 9.1 Required Functions

```js
function doGet(e) {}
function doPost(e) {}
function login(username, password) {}
function getCurrentUser(token) {}
function listStudents(filters) {}
function createGoodDeed(payload) {}
function updateGoodDeed(deedId, payload) {}
function deleteGoodDeed(deedId) {}
function approveGoodDeed(deedId, comment) {}
function rejectGoodDeed(deedId, comment) {}
function uploadEvidence(base64File, meta) {}
function compressImageOnClient(file) {}
function searchGoodDeeds(query, filters) {}
function toggleStar(deedId, userId) {}
function getProfile(studentId) {}
function generateCertificate(studentId, options) {}
function exportExcel(filters) {}
function exportPdfReport(filters) {}
function getDashboardStats(filters) {}
```

### 9.2 API Response Format

ทุก API ต้องตอบรูปแบบเดียวกัน

```json
{
  "ok": true,
  "data": {},
  "message": "success",
  "timestamp": "2026-06-21T00:00:00+07:00"
}
```

เมื่อ error

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "กรุณากรอกชื่อกิจกรรม"
  }
}
```

---

## 10. Image Upload & Compression

ภาพต้องบีบอัดฝั่ง client ก่อน upload

เงื่อนไข

- รองรับ jpg, png, webp
- แปลง preview เป็น webp ได้ถ้า browser รองรับ
- ความกว้างสูงสุด 1600 px
- quality เริ่มต้น 0.75
- ถ้าไฟล์ยังเกิน 1 MB ให้ลด quality ลงอีก
- เก็บ thumbnail ขนาด 420 px สำหรับ feed card
- PDF ไม่ต้องบีบอัด แต่ต้องจำกัดขนาด

Pseudo flow:

```text
select files
→ validate type and size
→ if image: load to canvas
→ resize max width 1600
→ export webp/jpeg quality 0.75
→ create thumbnail
→ upload compressed file
→ save file metadata to EvidenceFiles
```

---

## 11. Security & Privacy

ระบบนี้เกี่ยวข้องกับข้อมูลนักเรียน ห้ามทำแบบหลวม ๆ

ข้อกำหนดขั้นต่ำ

- ห้ามเปิดข้อมูลส่วนตัวแบบ public โดยไม่จำเป็น
- หน้าทดสอบใช้ mock data ได้ แต่ข้อมูลจริงต้องผ่าน login
- password production ต้อง hash หรือใช้ระบบ auth ของ Google/Firebase
- จำกัดสิทธิ์ตาม role
- ตรวจ MIME type และขนาดไฟล์ทุกครั้ง
- ป้องกันการ upload ไฟล์อันตราย
- บันทึก Activity Log ทุกการแก้ไขและอนุมัติ
- ใบประกาศทุกใบต้องมีเลขที่เอกสารและ QR verify
- ข้อมูลที่ export ต้องเหมาะสำหรับเสนอผู้บริหาร ไม่หลุดข้อมูลเกินจำเป็น

---

## 12. Report Template

รายงานผู้บริหารต้องมี

1. ชื่อรายงาน
2. ช่วงวันที่ / ภาคเรียน / ปีการศึกษา
3. สถิติภาพรวม
4. ตารางแยกชั้นปี
5. ตารางแยกหมวดกิจกรรม
6. Top 10 นักเรียนชั่วโมงความดีสูงสุด
7. รายการรอตรวจรับรอง
8. ปัญหา/ข้อเสนอแนะ
9. ช่องลงนามผู้จัดทำ / ผู้ตรวจ / ผู้รับรอง

---

## 13. Certificate Template Text

ตัวอย่างข้อความใบประกาศผล

```text
วิทยาลัยพยาบาลทหารอากาศ
ขอมอบใบประกาศผลบันทึกความดีฉบับนี้ให้แก่

[ยศ/คำนำหน้า ชื่อ-สกุล]
รหัสนักเรียน [studentId] ชั้นปีที่ [yearLevel] รุ่น [classNo]

เพื่อรับรองว่าเป็นผู้มีประวัติการเข้าร่วมกิจกรรมความดี
และกิจกรรมสาธารณประโยชน์ที่ได้รับการตรวจสอบแล้ว
รวมจำนวน [totalHours] ชั่วโมง
อยู่ในระดับ [meritLevel]

ให้ไว้ ณ วันที่ [issueDate]

ลงชื่อ ........................................
([signerName])
[signerPosition]
```

---

## 14. Acceptance Criteria

ถือว่างานผ่านเมื่อ

- เปิดจาก GitHub Pages ได้จริง
- Login demo ได้อย่างน้อย 3 role
- เพิ่มรายการบันทึกความดีได้
- แนบภาพแล้ว preview ได้
- ระบบบีบอัดภาพก่อนเก็บ mock/local ได้
- ค้นหาและ filter ได้
- สลับ Grid/List ได้
- กดดาวได้
- เปิด profile รายบุคคลได้
- ออกใบประกาศผล A4 ได้
- กด print แล้วหน้ากระดาษไม่เพี้ยน
- Export CSV/Excel อย่างน้อย mock ได้
- Dashboard สรุปข้อมูลได้
- Responsive บนมือถือ Android ได้ดี
- โค้ดไม่รวมกับโปรเจกต์อื่น และอยู่ใน folder `good-deed-certificate/`

---

## 15. Prompt สำหรับสั่ง Codex / AI Agent

ใช้ prompt นี้เมื่อให้ AI สร้างระบบ

```text
คุณคือ Senior Full Stack Engineer และ Senior UI/UX Designer
สร้าง Web Application แบบ Single Page Application สำหรับ GitHub Pages
โปรเจกต์ชื่อ good-deed-certificate ภายใต้ repo RTAFNC-

ระบบคือ “คลังบันทึกความดีและใบประกาศผล วพอ.”
สำหรับนักเรียนพยาบาลทหารอากาศ / นักเรียนทหารอากาศ
อ้างอิง UI จากระบบคลังผลงานครูในภาพตัวอย่าง:
- Login card สีแดง ขอบมน เงานุ่ม มีโลโก้กลางด้านบน
- หน้า feed มี navbar, filter, grid/list toggle, card รายการ
- modal เพิ่มข้อมูลขนาดใหญ่ มี field ครบถ้วน

ต้องทำเป็นไฟล์ HTML/CSS/JS แยก folder ชัดเจน ห้ามรวมกับโปรเจกต์อื่น
ให้ mock data ใช้งานได้ทันทีโดยยังไม่ต้องต่อ backend

ฟีเจอร์ที่ต้องมี:
1. Login demo: admin/1234, advisor/1234, student/1234
2. Dashboard สรุปจำนวนรายการ รอตรวจ รับรองแล้ว ชั่วโมงรวม
3. Feed รายการบันทึกความดีแบบ Grid และ List
4. Filter ตามหมวด ระดับ ภาคเรียน ปีการศึกษา และค้นหาชื่อนักเรียน
5. Modal เพิ่ม/แก้ไขรายการ พร้อมเลือกนักเรียนหลายคน
6. Upload หลักฐานรูป/PDF และบีบอัดภาพฝั่ง client ด้วย canvas
7. ระบบกดดาว 1 user ต่อ 1 รายการ
8. Profile นักเรียน แสดงกิจกรรมและชั่วโมงสะสม
9. Certificate page ออกใบประกาศผลบันทึกความดี A4 พร้อม print CSS
10. Export CSV/Excel mock
11. Responsive mobile-first
12. โทนสีราชการ ทหารอากาศ: แดงเลือดหมู น้ำเงิน ทอง ขาว เทา
13. ใช้ภาษาไทยทั้งหมดและฟอนต์ไทยอ่านง่าย
14. เตรียมไฟล์ README.md และ data dictionary

หลังสร้างเสร็จ ให้แจ้ง URL ที่คาดว่าจะเปิดได้:
https://anuchit1tube168-cmd.github.io/RTAFNC-/good-deed-certificate/
```

---

## 16. Prompt สำหรับต่อ Google Apps Script

```text
ต่อยอดระบบ good-deed-certificate ให้เชื่อม Google Apps Script + Google Sheets + Google Drive

ต้องสร้าง Apps Script backend ที่มี doGet/doPost และ API สำหรับ:
- login
- listStudents
- createGoodDeed
- updateGoodDeed
- approveGoodDeed
- rejectGoodDeed
- uploadEvidence
- searchGoodDeeds
- toggleStar
- getProfile
- generateCertificate
- exportExcel
- getDashboardStats

สร้าง Google Sheets tables:
Users, Students, GoodDeeds, Certificates, EvidenceFiles, Stars, Settings, ActivityLogs

การ upload ไฟล์ให้เก็บใน Google Drive folder แยกตามปีการศึกษา/เดือน
สร้าง PDF ใบประกาศผลด้วย template A4 และบันทึก URL กลับใน Certificates
ทุก API ต้องตอบ JSON รูปแบบ { ok, data, message, timestamp }
พร้อม error handling และ role-based permission
```

---

## 17. README Summary สำหรับหน้าโปรเจกต์

```md
# คลังบันทึกความดีและใบประกาศผล วพอ.

ระบบ Web Application สำหรับบันทึกกิจกรรมความดีของนักเรียนพยาบาลทหารอากาศ เก็บหลักฐาน อนุมัติรายการ ออกใบประกาศผล และสรุปรายงานผู้บริหาร

## Demo Login
- admin / 1234
- advisor / 1234
- student / 1234

## Features
- บันทึกกิจกรรมความดี
- แนบหลักฐานรูปภาพ/PDF
- บีบอัดภาพอัตโนมัติ
- ค้นหาและ Filter
- Grid/List View
- Star Recognition
- Student Profile
- Certificate PDF/Print
- Dashboard
- Export CSV/Excel

## Deploy
เปิดใช้งานผ่าน GitHub Pages:
https://anuchit1tube168-cmd.github.io/RTAFNC-/good-deed-certificate/
```

---

## 18. ขั้นตอนทำงานจริง

1. สร้าง folder `good-deed-certificate/`
2. สร้าง prototype แบบ mock data ให้เปิดบน GitHub Pages ก่อน
3. ตรวจ UI บนมือถือ
4. เติมระบบ print ใบประกาศผล
5. เติม export CSV/Excel
6. เติม image compression
7. เตรียม Google Sheets schema
8. เขียน Apps Script API
9. ทดสอบ upload หลักฐานจริง
10. ทดสอบ approve/reject
11. ทดสอบ PDF certificate
12. เปิดใช้จริงแบบจำกัดกลุ่ม
13. เก็บ feedback
14. ปรับ production security

---

## 19. Definition of Done

งานนี้เสร็จจริงเมื่อผู้ใช้สามารถทำ flow นี้ได้ครบ:

```text
นักเรียน login
→ เพิ่มกิจกรรมความดี
→ แนบหลักฐาน
→ ส่งให้อาจารย์ที่ปรึกษาตรวจ
→ อาจารย์รับรอง
→ รายการขึ้นในคลังผลงาน
→ นักเรียนดู profile ตัวเอง
→ ระบบคำนวณชั่วโมงรวม
→ กดออกใบประกาศผลบันทึกความดี
→ พิมพ์หรือดาวน์โหลด PDF
→ Admin export รายงานให้ผู้บริหาร
```

---

## 20. หมายเหตุสำคัญ

- โปรเจกต์นี้ต้องแยกจากระบบทุน กสศ. และระบบจัดซื้อจัดจ้าง ห้ามปน folder
- ตัวอย่าง `admin/1234` ใช้เฉพาะ demo เท่านั้น
- ข้อมูลนักเรียนจริงต้องไม่เปิด public
- GitHub Pages เหมาะกับ frontend ส่วนข้อมูลจริงควรอยู่ใน Google Apps Script / Firebase / Supabase
- ใบประกาศผลต้องมี QR verify เพื่อกันการปลอมแปลง
- รายงานผู้บริหารต้อง print ได้ทันที ไม่ต้องจัดหน้าใหม่
