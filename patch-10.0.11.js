(()=>{
'use strict';
const V='10.0.11';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stripNum=s=>String(s||'').replace(/^\s*\d+(?:\.\d+)?\s*[—-]\s*/, '').trim();
const APP=()=>window.APP||null;
function canonical(ex){return norm(ex?.canonical||ex?.name)}
function extracted(){return (APP()?.videos||[]).filter(v=>v.status==='EXTRAÍDO'&&v.sourcePool&&v.id)}
function rows(v){return (APP()?.exercises||[]).filter(ex=>ex.source===v.sourcePool)}
function cardExercise(card){
  const raw=stripNum(card.querySelector('.exname')?.textContent||'');
  const n=norm(raw),A=APP(); if(!n||!A)return null;
  let ex=A.exercises.find(x=>norm(x.name)===n);
  if(ex)return ex;
  ex=A.exercises.find(x=>canonical(x)===n);
  if(ex)return ex;
  return A.exercises.find(x=>{const nx=norm(x.name);return nx.length>4&&(n.includes(nx)||nx.includes(n))})||null;
}
function stepExercise(){
  const n=norm(document.getElementById('stepTitle')?.textContent||''),A=APP();if(!n||!A)return null;
  return A.exercises.find(x=>norm(x.name)===n)||A.exercises.find(x=>canonical(x)===n)||null;
}
function refFor(ex){
  if(!ex)return null;const ce=canonical(ex),ne=norm(ex.name);
  for(const v of extracted()){
    const rs=rows(v);let i=rs.findIndex(r=>canonical(r)===ce||norm(r.name)===ne);
    if(i<0)continue;
    const dur=Math.max(60,Math.round((+v.durationMin||0)*60));
    const intro=Math.min(24,Math.max(8,Math.round(dur*.012))),outro=Math.min(18,Math.max(6,Math.round(dur*.008)));
    const usable=Math.max(30,dur-intro-outro),seg=usable/Math.max(1,rs.length);
    const start=Math.max(0,Math.round(intro+i*seg+seg*.20));
    const end=Math.min(dur-1,Math.max(start+4,Math.round(start+Math.min(8,seg*.55))));
    return{videoId:v.id,creator:v.creator||'',title:v.title||'',start,end,index:i,total:rs.length};
  }
  return null;
}
function injectStyle(){if(document.getElementById('blueVisual111Style'))return;const s=document.createElement('style');s.id='blueVisual111Style';s.textContent=`.blueClip111{position:relative;width:100%;aspect-ratio:16/9;background:#0b1117;border-radius:12px;overflow:hidden}.blueClip111 iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.blueClip111 .lbl{position:absolute;left:7px;top:7px;z-index:3;background:rgba(11,95,158,.94);color:white;border-radius:999px;padding:4px 7px;font-size:10px;font-weight:800}.blueClip111 .meta{position:absolute;left:7px;bottom:7px;z-index:3;background:rgba(0,0,0,.68);color:white;border-radius:7px;padding:4px 6px;font-size:9px;font-weight:700}.blueClip111 .open{position:absolute;right:7px;top:7px;z-index:4;border:0;border-radius:8px;background:rgba(255,255,255,.94);color:#17324a;padding:5px 7px;font-size:10px;font-weight:800;cursor:pointer}.blueClip111 .loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;text-align:center;padding:12px}.blueVisual111Note{margin:8px 0;padding:9px 11px;border-radius:10px;background:#e8f4ff;color:#17324a;font-size:12px;line-height:1.45}`;document.head.appendChild(s)}
function clipHtml(ref){const m=Math.floor(ref.start/60),sec=String(ref.start%60).padStart(2,'0');return `<div class="blueClip111" data-blue-video="${ref.videoId}" data-blue-start="${ref.start}" data-blue-end="${ref.end}"><div class="loading">A carregar referência real do exercício…</div><span class="lbl">CLIP REAL</span><span class="meta">${ref.creator||'fonte'} · ~${m}:${sec}</span><button class="open" type="button">ABRIR</button></div>`}
let io=null;
function observer(){if(io)return io;io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;const b=e.target;if(b.dataset.loaded==='1')continue;const id=b.dataset.blueVideo,start=b.dataset.blueStart,end=b.dataset.blueEnd;if(!id)continue;const f=document.createElement('iframe');f.loading='lazy';f.allow='autoplay; encrypted-media; picture-in-picture';f.referrerPolicy='strict-origin-when-cross-origin';f.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1&loop=1&playlist=${encodeURIComponent(id)}&start=${start}&end=${end}`;b.prepend(f);b.dataset.loaded='1';const btn=b.querySelector('.open');if(btn)btn.onclick=ev=>{ev.preventDefault();ev.stopPropagation();window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}&t=${start}s`,'_blank','noopener')};io.unobserve(b)}},{rootMargin:'200px 0px'});return io}
function paintBox(box,ex){if(!box||!ex)return false;if(box.querySelector('img'))return true;if(box.querySelector('.blueClip111'))return true;const ref=refFor(ex);if(!ref)return false;box.innerHTML=clipHtml(ref);observer().observe(box.querySelector('.blueClip111'));return true}
function paintCards(){let total=0,shown=0;document.querySelectorAll('#blocks .exercise,#scrollMode .exercise').forEach(card=>{const ex=cardExercise(card),box=card.querySelector('.imgbox');if(!ex||!box)return;total++;if(box.querySelector('img')||paintBox(box,ex))shown++});const c=document.getElementById('frameCoverage');if(c&&total)c.textContent=`VISUAIS ${shown}/${total}`}
function paintStep(){const box=document.getElementById('stepImg'),ex=stepExercise();if(!box||!ex)return;if(box.querySelector('img')||box.querySelector('.blueClip111'))return;paintBox(box,ex)}
function addNote(){const src=document.getElementById('sourceBox');if(!src||document.getElementById('blueVisual111Note'))return;const d=document.createElement('div');d.id='blueVisual111Note';d.className='blueVisual111Note noprint';d.innerHTML='<b>VISUAIS:</b> a app procura automaticamente o mesmo exercício nas fontes já extraídas e mostra um excerto real. Imagens guardadas continuam a ter prioridade. Se não houver correspondência validada, não inventa uma imagem.';src.insertAdjacentElement('afterend',d)}
function badge(){const h=document.querySelector('header h1');if(h)h.textContent='BLUE SYMBIOTE v10.0.11';const s=document.querySelector('header .sub');if(s)s.textContent='MODO ESTÁVEL · VISUAIS REAIS AUTOMÁTICOS · TRAINING LAB · SOCIAL FLEXÍVEL · BLUE EDU'}
function run(){injectStyle();badge();addNote();paintCards();paintStep()}
function init(){if(!APP()||!document.querySelector('header')){setTimeout(init,80);return}run();const mo=new MutationObserver(()=>{clearTimeout(window.__blue111t);window.__blue111t=setTimeout(run,35)});for(const id of ['blocks','scrollMode','stepImg','stepTitle','sourceBox']){const el=document.getElementById(id);if(el)mo.observe(el,{childList:true,subtree:true,characterData:true})}document.addEventListener('click',()=>setTimeout(run,60),true);console.info('BLUE DOM VISUALS '+V+' ativo')}
init();
})();