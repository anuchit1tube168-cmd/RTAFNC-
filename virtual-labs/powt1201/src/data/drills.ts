export type Drill = {
  id: string;
  order: number;
  label: string;
  phase: 'stationary' | 'turning' | 'salute' | 'headgear' | 'march' | 'run';
};

export const drills: Drill[] = [
  { id: 'attention', order: 1, label: 'ท่าตรง', phase: 'stationary' },
  { id: 'chest', order: 2, label: 'ท่ายกอก', phase: 'stationary' },
  { id: 'rest-normal', order: 3, label: 'ท่าพักตามปกติ', phase: 'stationary' },
  { id: 'rest-order', order: 4, label: 'ท่าพักตามระเบียบ', phase: 'stationary' },
  { id: 'fall-out', order: 5, label: 'ท่าพักแถว', phase: 'stationary' },
  { id: 'left-turn', order: 6, label: 'ท่าซ้ายหัน', phase: 'turning' },
  { id: 'right-turn', order: 7, label: 'ท่าขวาหัน', phase: 'turning' },
  { id: 'about-turn', order: 8, label: 'ท่ากลับหลังหัน', phase: 'turning' },
  { id: 'salute', order: 9, label: 'ท่าวันทยหัตถ์', phase: 'salute' },
  { id: 'remove-cap', order: 10, label: 'ท่าถอดหมวก', phase: 'headgear' },
  { id: 'wear-cap', order: 11, label: 'ท่าสวมหมวก', phase: 'headgear' },
  { id: 'march', order: 12, label: 'ท่าเดินปกติ', phase: 'march' },
  { id: 'halt-march', order: 13, label: 'ท่าหยุดจากการเดิน', phase: 'march' },
  { id: 'parade-march', order: 14, label: 'ท่าเดินสวนสนาม', phase: 'march' },
  { id: 'halt-parade', order: 15, label: 'ท่าหยุดจากการสวนสนาม', phase: 'march' },
  { id: 'run', order: 16, label: 'ท่าวิ่ง', phase: 'run' },
  { id: 'halt-run', order: 17, label: 'ท่าหยุดจากการวิ่ง', phase: 'run' },
  { id: 'run-to-walk', order: 18, label: 'ท่าวิ่งเปลี่ยนเป็นเดิน', phase: 'run' },
  { id: 'walk-to-run', order: 19, label: 'ท่าเดินเปลี่ยนเป็นวิ่ง', phase: 'run' },
  { id: 'change-step-run', order: 20, label: 'ท่าเปลี่ยนเท้าในเวลาวิ่ง', phase: 'run' }
];

export const officialClo1 = {
  id: 'CLO1',
  text: 'ฝึกปฏิบัติบุคคลท่ามือเปล่าตามคู่มือฝึกพระราชทานได้',
  rawMax: 60,
  weightedMax: 40,
  levels: {
    3: 'ปฏิบัติได้ถูกต้องครบถ้วน เหมาะสม และทำได้ด้วยตนเองทั้งหมด',
    2: 'ปฏิบัติได้ถูกต้องเป็นส่วนใหญ่ โดยได้รับคำแนะนำบางส่วน',
    1: 'ไม่สามารถปฏิบัติได้ด้วยตนเอง หรือจำเป็นต้องได้รับคำชี้แนะ/ช่วยเหลือเป็นส่วนใหญ่'
  },
  convert(raw: number) {
    return Math.round((raw * 40 / 60) * 100) / 100;
  }
};
