(()=>{
'use strict';
const V='10.0.10';
const $=id=>document.getElementById(id);
function badge(){
  const h=document.querySelector('header h1');
  if(h)h.textContent='BLUE SYMBIOTE v10.0.10';
  const s=document.querySelector('header .sub');
  if(s)s.textContent='MODO ESTÁVEL · VISUAIS/CLIPS REAIS · TRAINING LAB · SOCIAL FLEXÍVEL · BLUE EDU';
}
function neutralizeUpdateUI(){
  const box=$('updateBox');if(box)box.style.display='none';
  const u=$('updateBtn'),a=$('applyUpdateBtn');
  if(u){u.disabled=true;u.title='Atualizações automáticas temporariamente estabilizadas';}
  if(a){a.disabled=true;a.title='Atualizações automáticas temporariamente estabilizadas';}
}
async function safeRegister(){
  if(!('serviceWorker' in navigator)||location.protocol==='file:')return;
  try{
    const regs=await navigator.serviceWorker.getRegistrations();
    const ours=regs.find(r=>r.scope===new URL('./',location.href).href);
    if(ours)return;
    await navigator.serviceWorker.register('./service-worker.js?v='+V,{scope:'./',updateViaCache:'none'});
  }catch(e){console.warn('Registo PWA estável adiado.',e)}
}
function init(){
  if(!window.APP||!document.querySelector('header')){setTimeout(init,80);return;}
  badge();neutralizeUpdateUI();
  setTimeout(safeRegister,4000);
  console.info('BLUE SAFE RUNTIME '+V+' ativo');
}
init();
})();