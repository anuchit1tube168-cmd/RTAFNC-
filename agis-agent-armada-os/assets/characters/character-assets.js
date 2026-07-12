/* AGIS Character Asset Loader v1.0
 * Text-safe image storage for GitHub: each character image is an AVIF encoded as Base64.
 */
window.AGIS_CHARACTERS = [
  {id:'agis',name:'AGIS',role:'Captain / Orchestrator',roleTh:'กัปตัน / ผู้ควบคุมระบบ',group:'command',color:'#36d9ff',tagline:'Route missions, coordinate agents, and guard the receipt gate.'},
  {id:'fable',name:'Fable',role:'Archivist / Master Trainer',roleTh:'นักจดหมายเหตุ / ครูฝึกหลัก',group:'research',color:'#9b6dff',tagline:'Preserve knowledge, refine skills, and train the fleet from real work.'},
  {id:'navigator',name:'Navigator',role:'Pathfinder / Requirement Mapper',roleTh:'ผู้นำทาง / นักแปลงความต้องการ',group:'command',color:'#55e6ff',tagline:'Map requirements, dependencies, risks, and the best mission route.'},
  {id:'shipwright',name:'Shipwright',role:'Engineer / Builder',roleTh:'วิศวกร / ผู้สร้างระบบ',group:'build',color:'#ffb35d',tagline:'Build web apps, automation, integrations, and deployment-ready systems.'},
  {id:'archaeologist',name:'Archaeologist',role:'Scholar / Knowledge Miner',roleTh:'นักวิชาการ / นักขุดค้นความรู้',group:'research',color:'#b486ff',tagline:'Excavate evidence, documents, data sources, and reusable institutional knowledge.'},
  {id:'doctor',name:'Doctor',role:'Medic / QA Debug',roleTh:'แพทย์ / ผู้ตรวจสอบและแก้จุดบกพร่อง',group:'qa',color:'#53f4d5',tagline:'Diagnose defects, verify outputs, assess risk, and block unsafe releases.'},
  {id:'swordsman',name:'Swordsman',role:'Vanguard / SOP Critic',roleTh:'แนวหน้า / ผู้ตรวจความคมชัดของขั้นตอน',group:'qa',color:'#ff6b67',tagline:'Cut ambiguity, challenge weak workflows, and enforce precise operating rules.'},
  {id:'cook',name:'Cook',role:'Quartermaster / Report Crafter',roleTh:'เสบียง / ผู้ปรุงรายงาน',group:'operations',color:'#ffbf56',tagline:'Turn raw mission output into clear reports, summaries, and delivery packages.'},
  {id:'sniper',name:'Sniper',role:'Ranger / Hook Specialist',roleTh:'พลแม่นปืน / ผู้เชี่ยวชาญ Hook',group:'operations',color:'#df63ff',tagline:'Target high-impact opportunities, hooks, SEO signals, and measurable outcomes.'},
  {id:'clone',name:'Clone',role:'Operative / Temporary Specialist',roleTh:'หน่วยปฏิบัติการ / ผู้เชี่ยวชาญชั่วคราว',group:'operations',color:'#8a6bff',tagline:'Create temporary specialist capacity, isolate tasks, and merge verified results.'}
];

window.AGIS_CHARACTER_ASSET_CACHE = new Map();
window.loadAgisCharacterAsset = async function loadAgisCharacterAsset(id, basePath='../../assets/characters/data') {
  if (!/^[a-z-]+$/.test(id)) throw new Error('Invalid AGIS character id');
  if (window.AGIS_CHARACTER_ASSET_CACHE.has(id)) return window.AGIS_CHARACTER_ASSET_CACHE.get(id);
  const response = await fetch(`${basePath}/${id}.b64`, {cache:'force-cache'});
  if (!response.ok) throw new Error(`Character asset not found: ${id}`);
  const base64 = (await response.text()).trim();
  const src = `data:image/avif;base64,${base64}`;
  window.AGIS_CHARACTER_ASSET_CACHE.set(id, src);
  return src;
};
