(()=>{'use strict';
const files=['project-forge-core.js','project-forge-ui.js','project-forge-app.js'];
function load(i){if(i>=files.length)return;const s=document.createElement('script');s.src=files[i];s.onload=()=>load(i+1);s.onerror=()=>console.error('Failed to load',files[i]);document.body.appendChild(s)}
load(0);
})();
