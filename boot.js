(async()=>{try{
const UI_FILES=["ui-1.txt","ui-2.txt"],DATA_FILES=["data-1.txt","data-2.txt","data-3.txt","data-4.txt","data-5.txt","data-6.txt","data-7.txt"],CODE_FILES=["code-1.txt","code-2.txt","code-3.txt","code-4.txt","code-5.txt","code-6.txt","code-7.txt"];
async function readAll(files){let s='';for(const f of files){const r=await fetch('./'+f,{cache:'no-store'});if(!r.ok)throw new Error('Falha a carregar '+f+' ('+r.status+')');s+=await r.text();}return s;}
document.body.innerHTML=await readAll(UI_FILES);document.body.dataset.appVersion='10.0.0';
const c=JSON.parse(await readAll(DATA_FILES)),fs=c.exerciseSchema.dictFields,ds=c.exerciseSchema.dictionaries;
const exercises=c.exerciseRows.map(r=>{const e={id:r[0],name:r[1],canonical:r[2]};let p=3;for(const f of fs)e[f]=ds[f][r[p++]];e.objective=r[p++]||'';e.notes=r[p++]||'';return e;});
window.APP={meta:c.meta,exercises,archetypes:c.archetypes,videos:c.videos,warmups:c.warmups,embeddedImages:c.embeddedImages||{}};window.APP_READY=Promise.resolve(window.APP);
const code=await readAll(CODE_FILES);(new Function('APP',code))(window.APP);
}catch(e){console.error('Falha ao iniciar BLUE Symbiote',e);document.body.innerHTML='<main style="padding:24px;font-family:Arial"><h2>BLUE Symbiote</h2><p>Falha ao iniciar a aplicação.</p><pre style="white-space:pre-wrap">'+String(e)+'</pre></main>';}})();
