(()=>{
'use strict';
const V='10.0.8';
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const cleanName=s=>norm(String(s||'').replace(/^\s*\d+(?:\.\d+)?\s*[—-]\s*/,''));
function app(){return window.APP||null}
function cls(){try{return typeof currentClass!=='undefined'?currentClass:null}catch(e){return null}}
function ckey(ex){try{return typeof canon==='function'?canon(ex):(ex?.canonical||norm(ex?.name))}catch(e){return ex?.canonical||norm(ex?.name)}}
function hasRealImage(ex){try{return typeof visualImagesFor==='function'&&(visualImagesFor(ex)||[]).length>0}catch(e){return false}}
function extractedVideos(){return (app()?.videos||[]).filter(v=>v.status==='EXTRAÍDO'&&v.sourcePool&&v.id)}
function sourceRows(v){return (app()?.exercises||[]).filter(ex=>ex.source===v.sourcePool)}
function currentPreferredVideo(){const c=cls(),v=c?.video;return v?.status==='EXTRAÍDO'&&v?.sourcePool?v:null}
function sameExercise(a,b){const ca=ckey(a),cb=ckey(b);if(ca&&cb&&ca===cb)return true;const na=norm(a?.name),nb=norm(b?.name);return !!na&&na===nb}
function findReference(ex){
 if(!ex||ex.source==='BLUE_SOCIAL')return null;
 const vids=extractedVideos(),preferred=currentPreferredVideo(),ordered=preferred?[preferred,...vids.filter(v=>v.id!==preferred.id)]:vids;
 for(const v of ordered){
   const rows=sourceRows(v);let i=rows.findIndex(r=>sameExercise(r,ex));
   if(i<0&&ex.source===v.sourcePool)i=rows.findIndex(r=>norm(r.name)===norm(ex.name));
   if(i>=0){
     const dur=Math.max(60,Math.round((+v.durationMin||0)*60));
     const intro=Math.min(24,Math.max(8,Math.round(dur*.012))),outro=Math.min(18,Math.max(6,Math.round(dur*.008)));
     const useful=Math.max(30,dur-intro-outro),seg=useful/Math.max(1,rows.length);
     const start=Math.max(0,Math.round(intro+i*seg+seg*.22));
     const end=Math.min(dur-1,Math.max(start+3,Math.round(start+Math.min(7,seg*.48))));
     return{videoId:v.id,videoTitle:v.title||'',creator:v.creator||'',sourcePool:v.sourcePool,index:i,total:rows.length,start,end,approx:true};
   }
 }
 return null
}
function annotateClass(){
 const c=cls();if(!c?.blocks)return;
 for(const b of c.blocks)for(const ex of (b.exercises||[])){
   if(hasRealImage(ex)){delete ex._blueVideoFlash;continue}
   const ref=findReference(ex);if(ref)ex._blueVideoFlash=ref;
 }
 setTimeout(paintAll,20)
}
function findClassExercise(card){
 const title=card.querySelector('.exname')?.textContent||'';const n=cleanName(title),c=cls();if(!n||!c?.blocks)return null;
 const all=c.blocks.flatMap(b=>b.exercises||[]);
 return all.find(ex=>norm(ex.name)===n)||all.find(ex=>n.includes(norm(ex.name))||norm(ex.name).includes(n))||null
}
function injectStyle(){if($('blueLiveFlashStyle'))return;const st=document.createElement('style');st.id='blueLiveFlashStyle';st.textContent=`
.liveFlash{position:relative;width:100%;aspect-ratio:16/9;background:#0b1117;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#fff}.liveFlash iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.liveFlashLabel{position:absolute;left:7px;top:7px;z-index:2;background:rgba(11,95,158,.92);color:#fff;padding:4px 7px;border-radius:999px;font-size:10px;font-weight:800;pointer-events:none}.liveFlashMeta{position:absolute;right:7px;bottom:7px;z-index:2;background:rgba(0,0,0,.68);color:#fff;padding:4px 6px;border-radius:8px;font-size:9px;font-weight:700;pointer-events:none}.liveFlashOpen{position:absolute;right:7px;top:7px;z-index:3;background:rgba(255,255,255,.92);color:#17324a;border:0;border-radius:8px;padding:5px 7px;font-size:10px;font-weight:800;cursor:pointer}.liveFlashFallback{padding:18px;text-align:center;line-height:1.4}.liveFlashFallback b{display:block;margin-bottom:4px}.flashCoverage{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#e8f4ff;color:#0b5f9e;font-size:11px;font-weight:800;margin-left:6px}
`;document.head.appendChild(st)}
let observer=null;
function getObserver(){if(observer)return observer;observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;const box=e.target;if(box.dataset.loaded==='1')continue;const id=box.dataset.video,start=box.dataset.start,end=box.dataset.end;if(!id)continue;const f=document.createElement('iframe');f.loading='lazy';f.allow='autoplay; encrypted-media; picture-in-picture';f.referrerPolicy='strict-origin-when-cross-origin';f.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${encodeURIComponent(id)}&start=${start}&end=${end}`;box.prepend(f);box.dataset.loaded='1';observer.unobserve(box)}} ,{rootMargin:'180px 0px'});return observer}
function flashMarkup(ref){const m=Math.floor(ref.start/60),s=String(ref.start%60).padStart(2,'0');return `<div class="liveFlash" data-video="${ref.videoId}" data-start="${ref.start}" data-end="${ref.end}"><span class="liveFlashLabel">CLIP REAL</span><button class="liveFlashOpen" type="button" data-open-video="${ref.videoId}" data-open-start="${ref.start}">ABRIR</button><span class="liveFlashMeta">${ref.creator||'fonte'} · ~${m}:${s}</span><div class="liveFlashFallback"><b>A carregar excerto real…</b><small>referência da biblioteca BLUE</small></div></div>`}
function paintCard(card,ex){
 const box=card.querySelector('.imgbox');if(!box||!ex)return;
 if(hasRealImage(ex))return;
 const ref=ex._blueVideoFlash||findReference(ex);if(!ref)return;
 ex._blueVideoFlash=ref;
 if(box.querySelector('.liveFlash'))return;
 box.innerHTML=flashMarkup(ref);
 const lf=box.querySelector('.liveFlash');getObserver().observe(lf);
 const open=box.querySelector('[data-open-video]');if(open)open.onclick=e=>{e.preventDefault();e.stopPropagation();window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(ref.videoId)}&t=${ref.start}s`,'_blank','noopener')}
}
function paintAll(){
 injectStyle();let total=0,visual=0;
 document.querySelectorAll('#blocks .exercise,#scrollMode .exercise').forEach(card=>{const ex=findClassExercise(card);if(!ex)return;total++;if(hasRealImage(ex)||ex._blueVideoFlash||findReference(ex))visual++;paintCard(card,ex)});
 const cov=$('frameCoverage');if(cov&&total)cov.textContent=`VISUAIS ${visual}/${total}`;
}
function wrapGeneration(){
 ['useVideo','adaptVideo'].forEach(fn=>{if(typeof window[fn]!=='function'||window[fn].__flash108)return;const old=window[fn],nw=function(...a){const r=old.apply(this,a);setTimeout(()=>{annotateClass();paintAll()},140);return r};nw.__flash108=true;window[fn]=nw});
 ['scratchBtn','scratchFromSuggest'].forEach(id=>{const b=$(id);if(!b||b.dataset.flash108==='1'||typeof b.onclick!=='function')return;const old=b.onclick;b.onclick=function(...a){const r=old.apply(this,a);setTimeout(()=>{annotateClass();paintAll()},140);return r};b.dataset.flash108='1'})
}
function patchRenders(){
 ['renderBuild','renderFollow'].forEach(fn=>{try{if(typeof window[fn]==='function'&&!window[fn].__flash108){const old=window[fn],nw=function(...a){const r=old.apply(this,a);setTimeout(paintAll,30);return r};nw.__flash108=true;window[fn]=nw}}catch(e){}})
}
function observeDom(){const targets=[$('blocks'),$('scrollMode')].filter(Boolean);const mo=new MutationObserver(()=>setTimeout(paintAll,20));targets.forEach(t=>mo.observe(t,{childList:true,subtree:true}))}
function statusNote(){const build=$('build'),src=$('sourceBox');if(!build||!src||$('liveFlashNote'))return;const el=document.createElement('div');el.id='liveFlashNote';el.className='storageNote noprint';el.style.marginTop='8px';el.innerHTML='<b>VISUAIS AUTOMÁTICOS:</b> quando existe uma referência exata numa fonte já extraída, a app mostra um <b>clip real curto</b> diretamente no exercício. Se já existir um frame guardado, o frame continua a ter prioridade. Não é usada uma imagem genérica de outro exercício.';(document.getElementById('frameCoverage')?.parentElement||src).insertAdjacentElement('afterend',el)}
function badge(){const h=document.querySelector('header h1');if(h)h.textContent='BLUE SYMBIOTE v10.0.8';const s=document.querySelector('header .sub');if(s)s.textContent='atualização automática · VISUAIS/CLIPS REAIS · TRAINING LAB · SOCIAL FLEXÍVEL · BLUE EDU'}
function init(){if(!window.APP||!$('blocks')){setTimeout(init,80);return}injectStyle();wrapGeneration();patchRenders();observeDom();statusNote();badge();annotateClass();paintAll();console.info('BLUE LIVE EXERCISE FLASH '+V+' ativo')}
init();
})();