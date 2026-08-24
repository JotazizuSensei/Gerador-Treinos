(()=>{
'use strict';
const V='10.0.12';
const DATA_URLS=[
 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json',
 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
];
const IMG_BASES=[
 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/',
 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'
];
let db=null,loading=null,lastCoverage='';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stripNum=s=>String(s||'').replace(/^\s*\d+(?:\.\d+)?\s*[—-]\s*/,'').trim();
const NOISE=new Set(['adapted','adaptado','alternating','alternate','alternado','controlled','controlado','dynamic','dinamico','slow','leve','light','mobility','mobilidade','flow','hold','isometric','iso','with','com','and','e','the','to','from','bodyweight','body','only','standing','seated','supine','prone','kneeling']);
const ALIASES=[
 [/shoulder circles?(?:\s*\+.*)?$/i,'arm circles'],
 [/arm circles?/i,'arm circles'],
 [/ankle circles?/i,'ankle circles'],
 [/shoulder stretch|shoulder extension/i,'shoulder stretch'],
 [/glute bridge|shoulder bridge|hip bridge/i,'butt lift bridge'],
 [/cat[\s-]*cow/i,'cat stretch'],
 [/child'?s pose/i,"child's pose"],
 [/down(?:ward)? dog/i,'downward facing dog'],
 [/cobra/i,'cobra'],
 [/bird dog/i,'bird dog'],
 [/dead bug/i,'dead bug'],
 [/side plank/i,'side bridge'],
 [/front plank|\bplank\b/i,'plank'],
 [/mountain climber/i,'mountain climber'],
 [/reverse crunch/i,'reverse crunch'],
 [/bicycle|air bike/i,'air bike'],
 [/bodyweight squat|air squat|\bsquat\b/i,'bodyweight squat'],
 [/walking lunge/i,'walking lunge'],
 [/reverse lunge/i,'reverse lunge'],
 [/forward lunge|\blunge\b/i,'barbell lunge'],
 [/good morning/i,'good morning'],
 [/hamstring stretch/i,'hamstring stretch'],
 [/90[\s/]*90 hamstring/i,'90 90 hamstring'],
 [/hip flexor stretch/i,'kneeling hip flexor'],
 [/pigeon/i,'pigeon pose'],
 [/thoracic.*rotation|open book/i,'spine twist'],
 [/standing side bend|lateral flexion/i,'standing side bend'],
 [/calf stretch/i,'calf stretch hands against wall'],
 [/quadriceps stretch|quad stretch/i,'standing quadriceps stretch'],
 [/inch ?worm/i,'inchworm'],
 [/push[\s-]*up/i,'push ups'],
 [/sit[\s-]*up/i,'sit up'],
 [/crunch/i,'crunch'],
 [/russian twist/i,'russian twist'],
 [/leg raise/i,'flat bench lying leg raise'],
 [/superman/i,'superman'],
 [/hip thrust/i,'barbell hip thrust'],
 [/kettlebell swing|kb swing/i,'one arm kettlebell swing'],
 [/goblet squat/i,'goblet squat'],
 [/farmer.*carry|farmer.*walk/i,'farmers walk'],
 [/bear crawl/i,'bear crawl'],
 [/jumping jack/i,'jumping jack']
];
function tokens(s){return norm(s).split(/\s+/).filter(x=>x.length>1&&!NOISE.has(x))}
function compact(s){return tokens(s).join(' ')}
function aliasFor(name){for(const [re,val] of ALIASES)if(re.test(name))return val;return''}
function dice(a,b){const A=new Set(tokens(a)),B=new Set(tokens(b));if(!A.size||!B.size)return 0;let n=0;for(const x of A)if(B.has(x))n++;return 2*n/(A.size+B.size)}
function scoreName(query,item){const q=compact(query),n=compact(item.name);if(!q||!n)return 0;if(q===n)return 1;if(n.includes(q)||q.includes(n))return Math.min(.96,.76+Math.min(q.length,n.length)/Math.max(q.length,n.length)*.18);let s=dice(q,n);const qt=tokens(q),nt=tokens(n);if(qt.length&&nt.length&&qt[0]===nt[0])s+=.06;return Math.min(1,s)}
async function loadDB(){if(db)return db;if(loading)return loading;loading=(async()=>{let err;for(const u of DATA_URLS){try{const r=await fetch(u,{mode:'cors',cache:'force-cache'});if(!r.ok)throw new Error('HTTP '+r.status);const x=await r.json();if(Array.isArray(x)&&x.length>500){db=x;return db}}catch(e){err=e}}throw err||new Error('Base visual indisponível')})().finally(()=>{loading=null});return loading}
function nameFromCard(card){return stripNum(card.querySelector('.exname')?.textContent||'')}
function findMatch(name){if(!db||!name)return null;const a=aliasFor(name);if(a){const exact=db.find(x=>norm(x.name)===norm(a));if(exact)return{item:exact,score:1,mode:'alias'}}
 const parts=String(name).split(/\+|→|\/|&/).map(x=>x.trim()).filter(Boolean);const queries=[name,...parts];let best=null;
 for(const q of queries){const aq=aliasFor(q),qq=aq||q;for(const item of db){const s=scoreName(qq,item);if(!best||s>best.score)best={item,score:s,mode:aq?'alias':'fuzzy',query:q}}}
 return best&&best.score>=.74?best:null}
function imgUrl(path,base=0){return IMG_BASES[base]+String(path||'').split('/').map(encodeURIComponent).join('/')}
function injectStyle(){if(document.getElementById('blueOpenVisualStyle'))return;const s=document.createElement('style');s.id='blueOpenVisualStyle';s.textContent=`
.blueOpenVisual{position:relative;width:100%;min-height:118px;height:100%;background:#f7fafc;border-radius:10px;overflow:hidden;border:1px solid #d6e3ec;display:flex;align-items:center;justify-content:center}.blueOpenVisual img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#fff;transition:opacity .35s ease}.blueOpenVisual.two img:nth-of-type(1){animation:blueRefA 4.4s infinite}.blueOpenVisual.two img:nth-of-type(2){animation:blueRefB 4.4s infinite}.blueOpenVisual .lbl{position:absolute;left:6px;top:6px;z-index:4;background:rgba(11,95,158,.94);color:#fff;border-radius:999px;padding:4px 7px;font-size:9px;font-weight:800}.blueOpenVisual .meta{position:absolute;left:6px;right:6px;bottom:6px;z-index:4;background:rgba(0,0,0,.62);color:#fff;border-radius:7px;padding:4px 6px;font-size:9px;line-height:1.25}.blueOpenLoading{font-size:11px;color:#53697a;text-align:center;padding:12px}.blueVisualStatus{margin:8px 0;padding:9px 11px;border-radius:10px;background:#e8f4ff;color:#17324a;font-size:12px;line-height:1.45}.blueVisualStatus.warn{background:#fff4e5;color:#6b4a00}@keyframes blueRefA{0%,43%{opacity:1}50%,93%{opacity:0}100%{opacity:1}}@keyframes blueRefB{0%,43%{opacity:0}50%,93%{opacity:1}100%{opacity:0}}
`;document.head.appendChild(s)}
function visualHtml(match){const it=match.item,imgs=(it.images||[]).filter(Boolean).slice(0,2);const cls=imgs.length>1?'blueOpenVisual two':'blueOpenVisual';const nodes=imgs.map((p,i)=>`<img loading="lazy" decoding="async" data-blue-ref-img="${i}" src="${imgUrl(p)}" alt="${String(it.name||'').replace(/"/g,'&quot;')}">`).join('');return `<div class="${cls}" data-blue-open-ref="1"><span class="lbl">REF. VISUAL</span>${nodes}<span class="meta">${it.name} · base pública</span></div>`}
function existingVisual(box){return !!box.querySelector('img:not([data-blue-ref-img]),.blueClip111,.liveFlash')}
function paintOpenVisuals(){if(!db)return;let total=0,shown=0,openCount=0;document.querySelectorAll('#blocks .exercise,#scrollMode .exercise').forEach(card=>{const box=card.querySelector('.imgbox');if(!box)return;total++;if(existingVisual(box)){shown++;return}if(box.querySelector('[data-blue-open-ref="1"]')){shown++;openCount++;return}const name=nameFromCard(card),m=findMatch(name);if(!m)return;box.innerHTML=visualHtml(m);shown++;openCount++});
 const step=document.getElementById('stepImg');if(step&&!existingVisual(step)&&!step.querySelector('[data-blue-open-ref="1"]')){const name=document.getElementById('stepTitle')?.textContent||'',m=findMatch(name);if(m)step.innerHTML=visualHtml(m)}
 const c=document.getElementById('frameCoverage');if(c&&total)c.textContent=`VISUAIS ${shown}/${total}`;const status=`${shown}/${total} exercícios com visual nesta vista${openCount?` · ${openCount} pela base visual pública`:''}`;if(status!==lastCoverage){lastCoverage=status;setStatus(status,shown<total)}
}
function setStatus(msg,warn=false){const src=document.getElementById('sourceBox');if(!src)return;let d=document.getElementById('blueVisualStatus');if(!d){d=document.createElement('div');d.id='blueVisualStatus';d.className='blueVisualStatus noprint';src.insertAdjacentElement('afterend',d)}d.className='blueVisualStatus noprint'+(warn?' warn':'');d.innerHTML='<b>VISUAIS AUTOMÁTICOS:</b> '+msg+(warn?'<br><span>Os que continuam sem imagem não têm correspondência segura; a app não inventa uma demonstração errada.</span>':'')}
async function run(){injectStyle();setStatus('a carregar biblioteca visual…');try{await loadDB();paintOpenVisuals()}catch(e){console.warn('BLUE open visual DB indisponível',e);setStatus('base visual externa indisponível nesta ligação.',true)}}
function badge(){const h=document.querySelector('header h1');if(h)h.textContent='BLUE SYMBIOTE v10.0.12';const s=document.querySelector('header .sub');if(s)s.textContent='MODO ESTÁVEL · VISUAIS REAIS + BASE PÚBLICA · TRAINING LAB · SOCIAL FLEXÍVEL · BLUE EDU'}
function init(){if(!window.APP||!document.querySelector('header')){setTimeout(init,80);return}badge();run();const mo=new MutationObserver(()=>{clearTimeout(window.__blue120t);window.__blue120t=setTimeout(()=>{if(db)paintOpenVisuals();else run()},80)});for(const id of ['blocks','scrollMode','stepImg','stepTitle','sourceBox']){const el=document.getElementById(id);if(el)mo.observe(el,{childList:true,subtree:true,characterData:true})}document.addEventListener('click',()=>setTimeout(()=>db&&paintOpenVisuals(),100),true);console.info('BLUE OPEN VISUAL FALLBACK '+V+' ativo')}
init();
})();