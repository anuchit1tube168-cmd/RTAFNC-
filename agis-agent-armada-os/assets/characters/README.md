# AGIS Character Assets

ชุดภาพ Character Turnaround ของลูกเรือ AGIS ทั้ง 10 ตัวสำหรับใช้งานในระบบจริง

## สิ่งที่ติดตั้งแล้ว

- Character Codex: `ui/crew/character-codex.html`
- Shared loader: `assets/characters/character-assets.js`
- Manifest: `assets/characters/manifest.json`
- Character data: `assets/characters/data/*.b64`

## วิธีใช้ในหน้าเว็บ

```html
<script src="../../assets/characters/character-assets.js"></script>
<img id="agis-profile" alt="AGIS profile">
<script>
  loadAgisCharacterAsset('agis').then(src => {
    document.getElementById('agis-profile').src = src;
  });
</script>
```

## เหตุผลที่เก็บเป็น `.b64`

GitHub connector ใน workflow นี้เขียนไฟล์ข้อความได้โดยตรง จึงแปลงภาพเป็น AVIF ขนาดเว็บและเก็บแบบ Base64 text จากนั้น loader จะประกอบเป็น `data:image/avif;base64,...` ในเบราว์เซอร์

## ขอบเขตการใช้งาน

ภาพชุดนี้พร้อมใช้เป็น Character Profile, Codex, Agent Detail และ Production Reference แล้ว แต่ยังไม่ใช่ Animation Sprite Strip สำหรับการเดิน/ต่อสู้ การทำเกมขั้นต่อไปต้องกำหนดขนาดเฟรม, anchor point และ animation states ให้คงที่
