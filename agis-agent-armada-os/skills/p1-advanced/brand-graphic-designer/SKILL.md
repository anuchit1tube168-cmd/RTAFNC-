# Brand Graphic Designer Skill — SKILL.md

## Purpose
แปลงหัวข้อสินค้า/บริการ/ไอเดียคร่าว ๆ ให้กลายเป็นภาพคอนเทนต์ที่พร้อมสร้างสำหรับ Instagram, Facebook, TikTok, Ads หรือ Carousel โดยรักษาโทนแบรนด์ อ่านง่าย และพร้อมให้พนักงานหรือ AI สร้างงานต่อได้จริง

## Trigger
ใช้ skill นี้เมื่อ Boss ต้องการ:
- ออกแบบภาพ social media
- ทำภาพโฆษณา/Ads
- ทำภาพ carousel
- ทำ key visual สำหรับคอนเทนต์
- แปลงข้อมูลสินค้าเป็น prompt สร้างภาพ
- ตรวจว่า GR/Graphic พร้อมใช้แทนพนักงานได้หรือไม่

## Owner Agent
Primary: Copy Chef
Support: Hook Sniper, Blade SEO, Jin Guard, Forge Dev

## Inputs
- Brand name
- Business/product/service
- Target audience
- Brand personality
- Main colors
- Forbidden colors
- Visual style
- Required elements: logo, username, website, phone, CTA
- Prohibited elements
- Content topic or raw product idea
- Platform: Instagram / Facebook / TikTok / Ads / Carousel

## Process
1. Read brand data
2. Extract one core idea only
3. Shorten long text without changing meaning
4. Write strong headline
5. Write short body copy
6. Add accent note / CTA / highlight
7. Define visual direction
8. Create image generation prompt
9. Run design QA checklist
10. Return one image concept only

## Output Contract
Always return:
- Headline
- Body
- Accent note
- Visual direction
- Image generation prompt
- Design QA result

## Design Rules
1. Create one image at a time
2. One image = one main idea
3. Text must be short and easy to read
4. Headline must be the most dominant element
5. Keep the same visual style across a campaign
6. Preserve brand tone and color system
7. If source info is long, summarize without changing meaning
8. Do not add facts not provided by the user
9. If real image is needed, use placeholder only

## Design QA Checklist
- Image is not cluttered
- Brand colors are consistent
- Text is readable on mobile
- Headline is clearly dominant
- One clear focal point exists
- Suitable for chosen platform
- No unsupported claims added
- Required brand elements included
- Does not look too salesy if brand forbids direct-sale style

## Test Plan
Test with one real content topic:
1. User gives raw topic or product idea
2. Agent creates one image concept
3. Agent produces image generation prompt
4. Jin Guard checks unsupported claims
5. Boss approves or requests revision

## Evidence
- Final prompt
- Generated image or design mockup
- Design QA result
- Boss approval or revision note
- Receipt ID

## Fallback
If image generation tool is unavailable:
- Produce a Canva-ready layout brief
- Produce layer structure
- Produce copy blocks and layout grid
- Use placeholder image instructions

## Agent Injection
- Copy Chef: main designer/copy layout owner
- Hook Sniper: hook, CTA, ad angle
- Blade SEO: title/keyword/platform searchability
- Jin Guard: claim/risk/brand rule check
- Forge Dev: convert to Canva/Lovable/UI implementation when needed

## Level Up Rule
- Useful: creates one clean image concept with prompt
- Senior Candidate: creates 5+ consistent brand posts with QA pass
- Master Candidate: creates full campaign system across platforms
- Clone Ready: another agent can use the same template without brand drift

## Failure Modes
- Too much text
- Too many colors
- Headline not dominant
- Adds unsupported claim
- Uses real photo when only placeholder allowed
- Style changes every image
- Looks too much like generic sales design

## Revision Rule
If design fails QA, revise only one layer at a time:
1. Copy
2. Layout
3. Color
4. Visual direction
5. CTA
