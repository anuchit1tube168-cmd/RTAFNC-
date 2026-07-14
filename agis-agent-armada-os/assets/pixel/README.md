# AGIS Pixel Game Assets

คลังภาพ Pixel Art สำหรับต่อยอดเกมและหน้า AGIS Dashboard แบ่งเป็น 4 หมวดหลัก

1. `characters` — ตัวละคร 10 Hero แบบ Front / Side / Back / Action
2. `equipment` — อุปกรณ์เฉพาะอาชีพและ Generic Props
3. `tileset` — พื้น ผนัง ประตู ฉาก ห้องเฉพาะสายงาน และ Effect Tiles
4. `worldMap` — แผนที่โลก Hub Map, Mission Map และ Tactical Minimap

## เปิดดูผ่านหน้า Library

เปิด `../../ui/pixel/pixel-asset-library.html` ผ่านเว็บเซิร์ฟเวอร์หรือ GitHub Pages

> ไม่ควรเปิดด้วย `file://` โดยตรง เพราะ Browser อาจบล็อก `fetch()` ที่ใช้ประกอบไฟล์ Base64 หลายส่วน

## โหลดภาพในหน้าเว็บ

```html
<script src="../../assets/pixel/pixel-assets.js"></script>
<img id="pixel-map" alt="AGIS World Map">
<script>
  loadAgisPixelAsset("worldMap").then((src) => {
    document.getElementById("pixel-map").src = src;
  });
</script>
```

ดาวน์โหลดจากหน้าเว็บ:

```js
downloadAgisPixelAsset("characters", "agis-pixel-characters.avif");
```

## ประกอบไฟล์ด้วย Command Line

```bash
cat data/characters-preview.part-*.b64 \
  | tr -d '\n\r ' \
  | base64 --decode \
  > characters-preview.avif
```

หมวดอื่นใช้รูปแบบเดียวกัน:

- `equipment-props-preview.part-*.b64`
- `tileset-environment-preview.part-*.b64`
- `world-map-preview.part-*.b64`

## Production Rules

- ตั้งค่า Render เป็น `image-rendering: pixelated`
- ใช้ Nearest Neighbor เมื่อต้องขยายภาพ
- ตัด Sprite ด้วย Grid คงที่และกำหนด Pivot/Anchor ให้เหมือนกัน
- ภาพชุดนี้เป็น Master Reference และ Preview Atlas; Animation เดิน วิ่ง โจมตี และสถานะแต่ละเฟรมควรแยกสร้างเพิ่ม
- ตรวจตัวสะกดขนาดเล็กในภาพก่อนใช้เป็นข้อความจริงภายในเกม
