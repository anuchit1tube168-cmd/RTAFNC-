const menuBtn=document.querySelector('#menuBtn');const nav=document.querySelector('#mainNav');
menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
const dialog=document.querySelector('#serviceDialog');const title=document.querySelector('#dialogTitle');
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>{title.textContent=btn.dataset.modal;dialog.showModal()}));
document.querySelector('#dialogClose')?.addEventListener('click',()=>dialog.close());document.querySelector('#dialogOk')?.addEventListener('click',()=>dialog.close());
document.querySelector('#contrastBtn')?.addEventListener('click',()=>document.documentElement.classList.toggle('high-contrast'));
document.querySelectorAll('[data-show-all]').forEach(btn=>btn.addEventListener('click',()=>alert('ต้นแบบ UI: ในเวอร์ชันจริง ปุ่มนี้จะเปิดหน้ารวมรายการพร้อมค้นหา หมวดหมู่ และตัวกรองปี/เดือน')));
