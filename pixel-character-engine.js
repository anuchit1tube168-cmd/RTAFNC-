(() => {
  'use strict';

  const SIZE = 64;
  const animations = new WeakMap();

  const crew = [
    { id:'agis', name:'AGIS', role:'Captain / Orchestrator', primary:'#1f6feb', secondary:'#f4c15d', skin:'#d7a078', hair:'#101827', ink:'#07111c', accessory:'crown', expression:'focused' },
    { id:'fable', name:'Fable', role:'Master Skill Architect', primary:'#7c5cff', secondary:'#5fe1d3', skin:'#e0aa80', hair:'#2f204d', ink:'#0d1020', accessory:'crystal', expression:'calm' },
    { id:'navigator', name:'Navigator', role:'Routing & Planning', primary:'#1cb5a3', secondary:'#f2cf67', skin:'#c98e6a', hair:'#162b32', ink:'#071820', accessory:'compass', expression:'alert' },
    { id:'archaeologist', name:'Archaeologist', role:'Research & Evidence', primary:'#8c63c7', secondary:'#e0bd6a', skin:'#d9a17a', hair:'#2c1e35', ink:'#100b17', accessory:'book', expression:'focused' },
    { id:'shipwright', name:'Shipwright', role:'Builder / Engineer', primary:'#d96b3b', secondary:'#f0c45b', skin:'#c98862', hair:'#2b2421', ink:'#170d09', accessory:'hammer', expression:'happy' },
    { id:'doctor', name:'Doctor', role:'Quality Assurance', primary:'#e7edf5', secondary:'#4dd39a', skin:'#ddb08c', hair:'#506070', ink:'#11202e', accessory:'cross', expression:'calm' },
    { id:'swordsman', name:'Swordsman', role:'Security & Risk Guard', primary:'#263b55', secondary:'#ff667a', skin:'#c88d69', hair:'#0d1118', ink:'#05080d', accessory:'sword', expression:'alert' },
    { id:'cook', name:'Cook', role:'Output & Brand Design', primary:'#f08b3f', secondary:'#f7d36e', skin:'#e2ad82', hair:'#5b2d1c', ink:'#1b0d08', accessory:'pan', expression:'happy' },
    { id:'sniper', name:'Sniper', role:'Precision & Content Hooks', primary:'#2f8fd7', secondary:'#c7ef5b', skin:'#bd825f', hair:'#1a2938', ink:'#07111c', accessory:'target', expression:'focused' },
    { id:'clone', name:'Clone', role:'Reusable Specialist', primary:'#64748b', secondary:'#63e6ff', skin:'#d1a17c', hair:'#263244', ink:'#0b111b', accessory:'clone', expression:'calm' }
  ];

  const byId = Object.fromEntries(crew.map(item => [item.id, item]));

  function shade(hex, factor) {
    const n = Number.parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * factor)));
    const g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * factor)));
    const b = Math.max(0, Math.min(255, Math.round((n & 255) * factor)));
    return `#${[r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')}`;
  }

  function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function line(ctx, x1, y1, x2, y2, color, width=2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();
  }

  function drawAccessory(ctx, spec, x, y, mode, frame) {
    const gold = spec.secondary;
    const ink = spec.ink;
    const pulse = mode === 'action' ? (frame % 2 ? 1 : 0) : 0;
    switch (spec.accessory) {
      case 'crown':
        rect(ctx,x-9,y-4,18,3,ink); rect(ctx,x-8,y-8,3,6,gold); rect(ctx,x-1,y-11,3,9,gold); rect(ctx,x+6,y-8,3,6,gold);
        break;
      case 'crystal':
        rect(ctx,x+13,y+13,7+pulse,7+pulse,ink); rect(ctx,x+15,y+15,3+pulse,3+pulse,gold);
        break;
      case 'compass':
        rect(ctx,x+12,y+12,10,10,ink); rect(ctx,x+14,y+14,6,6,gold); line(ctx,x+17,y+14,x+17,y+20,ink,1);
        break;
      case 'book':
        rect(ctx,x+11,y+14,12,12,ink); rect(ctx,x+13,y+16,4,8,gold); rect(ctx,x+18,y+16,3,8,shade(gold,.82));
        break;
      case 'hammer':
        rect(ctx,x+14,y+9,3,21,gold); rect(ctx,x+9,y+7,13,7,ink); rect(ctx,x+10,y+8,11,4,shade(spec.primary,.65));
        break;
      case 'cross':
        rect(ctx,x+13,y+12,6,18,gold); rect(ctx,x+8,y+18,16,6,gold);
        break;
      case 'sword':
        line(ctx,x+11,y+5,x+23,y+31,gold,2); line(ctx,x+10,y+5,x+22,y+31,ink,4); line(ctx,x+9,y+22,x+18,y+18,gold,3);
        break;
      case 'pan':
        rect(ctx,x+10,y+13,12,12,ink); rect(ctx,x+12,y+15,8,8,shade(gold,.85)); line(ctx,x+20,y+23,x+27,y+30,ink,4);
        break;
      case 'target':
        rect(ctx,x+11,y+13,12,12,ink); rect(ctx,x+13,y+15,8,8,gold); rect(ctx,x+16,y+18,2,2,ink);
        break;
      case 'clone':
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(x+9,y+12,10,12); ctx.strokeStyle = ink; ctx.strokeRect(x+13,y+16,10,12);
        break;
      default:
        break;
    }
  }

  function drawCharacter(target, specOrId, options={}) {
    const canvas = target;
    const spec = typeof specOrId === 'string' ? byId[specOrId] : specOrId;
    if (!canvas || !spec) throw new Error('Canvas and valid character are required.');

    const mode = options.mode || 'idle';
    const frame = Number(options.frame || 0) % 4;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d', { alpha:true });
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0,0,SIZE,SIZE);

    const bob = mode === 'idle' ? [0,-1,0,1][frame] : 0;
    const walk = mode === 'walk' ? [-2,2,2,-2][frame] : 0;
    const action = mode === 'action' ? [0,-1,-2,-1][frame] : 0;
    const cx = 32;
    const top = 7 + bob + action;
    const primaryDark = shade(spec.primary,.63);
    const primaryLight = shade(spec.primary,1.18);
    const skinShadow = shade(spec.skin,.82);

    rect(ctx,20,56,24,4,'rgba(3,8,16,.55)');
    rect(ctx,cx-11+walk,top+43,8,12,spec.ink);
    rect(ctx,cx+3-walk,top+43,8,12,spec.ink);
    rect(ctx,cx-13,top+28,26,18,primaryDark);
    rect(ctx,cx-10,top+27,20,17,spec.primary);
    rect(ctx,cx-8,top+28,16,6,primaryLight);
    rect(ctx,cx-2,top+28,4,16,spec.secondary);

    const leftArm = mode === 'walk' ? walk : (mode === 'action' ? -3 : 0);
    const rightArm = mode === 'walk' ? -walk : (mode === 'action' ? 4 : 0);
    rect(ctx,cx-17,top+30+leftArm,5,14,primaryDark);
    rect(ctx,cx+12,top+30+rightArm,5,14,primaryDark);
    rect(ctx,cx-17,top+42+leftArm,5,4,spec.skin);
    rect(ctx,cx+12,top+42+rightArm,5,4,spec.skin);

    rect(ctx,cx-11,top+7,22,21,spec.ink);
    rect(ctx,cx-9,top+8,18,19,spec.skin);
    rect(ctx,cx-9,top+23,18,4,skinShadow);
    rect(ctx,cx-10,top+6,20,7,spec.hair);
    rect(ctx,cx-11,top+10,4,12,spec.hair);
    rect(ctx,cx+7,top+10,4,12,spec.hair);

    if (spec.id === 'fable') { rect(ctx,cx-12,top+4,24,4,spec.secondary); }
    if (spec.id === 'doctor') { rect(ctx,cx-12,top+4,24,5,'#e9f2fb'); rect(ctx,cx-2,top+3,4,7,spec.secondary); }
    if (spec.id === 'cook') { rect(ctx,cx-10,top+2,20,5,'#fff3d1'); rect(ctx,cx-7,top-1,14,5,'#fff3d1'); }
    if (spec.id === 'swordsman') { rect(ctx,cx-12,top+8,4,12,spec.secondary); }
    if (spec.id === 'clone') { rect(ctx,cx-8,top+10,16,8,'rgba(99,230,255,.35)'); }

    const eyeY = top + 17;
    if (spec.expression === 'happy') {
      line(ctx,cx-6,eyeY,cx-3,eyeY+2,spec.ink,1); line(ctx,cx+3,eyeY+2,cx+6,eyeY,spec.ink,1); line(ctx,cx-2,eyeY+7,cx+2,eyeY+8,spec.ink,1);
    } else {
      rect(ctx,cx-6,eyeY,3,3,spec.ink); rect(ctx,cx+3,eyeY,3,3,spec.ink);
      if (spec.expression === 'alert') { line(ctx,cx-7,eyeY-3,cx-3,eyeY-4,spec.ink,1); line(ctx,cx+3,eyeY-4,cx+7,eyeY-3,spec.ink,1); }
      if (spec.expression === 'focused') { line(ctx,cx-7,eyeY-4,cx-3,eyeY-2,spec.ink,1); line(ctx,cx+3,eyeY-2,cx+7,eyeY-4,spec.ink,1); }
      line(ctx,cx-2,eyeY+7,cx+2,eyeY+7,spec.ink,1);
    }

    drawAccessory(ctx,spec,cx,top,mode,frame);
    return canvas;
  }

  function start(canvas, specOrId, mode='idle') {
    stop(canvas);
    let frame = 0;
    let last = 0;
    const tick = (time) => {
      if (time - last >= 150) {
        drawCharacter(canvas,specOrId,{mode,frame});
        frame = (frame + 1) % 4;
        last = time;
      }
      animations.set(canvas, requestAnimationFrame(tick));
    };
    animations.set(canvas, requestAnimationFrame(tick));
  }

  function stop(canvas) {
    const id = animations.get(canvas);
    if (id) cancelAnimationFrame(id);
    animations.delete(canvas);
  }

  function downloadCanvas(canvas, filename) {
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'agis-pixel-character.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }

  function downloadSpriteSheet(specOrId, mode='idle') {
    const spec = typeof specOrId === 'string' ? byId[specOrId] : specOrId;
    if (!spec) throw new Error('Unknown AGIS character.');
    const sheet = document.createElement('canvas');
    sheet.width = SIZE * 4;
    sheet.height = SIZE;
    const ctx = sheet.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    for (let frame=0; frame<4; frame += 1) {
      const frameCanvas = document.createElement('canvas');
      drawCharacter(frameCanvas,spec,{mode,frame});
      ctx.drawImage(frameCanvas,frame*SIZE,0);
    }
    downloadCanvas(sheet,`agis-${spec.id}-${mode}-sheet.png`);
  }

  window.AGIS_PIXEL_STUDIO = Object.freeze({
    version:'1.1.0',
    size:SIZE,
    crew:Object.freeze(crew),
    byId:Object.freeze(byId),
    drawCharacter,
    start,
    stop,
    downloadCanvas,
    downloadSpriteSheet
  });
})();
