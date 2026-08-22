(()=>{
'use strict';
const PATCH_VERSION='10.0.4';
const LAB_KEY='blue_symbiote_training_lab_v10_4';
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

function addOption(listId,value){const dl=$(listId);if(!dl||[...dl.options].some(o=>o.value===value))return;const o=document.createElement('option');o.value=value;dl.appendChild(o);}
function addTrainingLabField(){
 const grid=$('classType')?.closest('.grid');if(!grid||$('spaceProfile'))return;
 const field=document.createElement('div');field.className='field';field.innerHTML='<label>Espaço / preset</label><input id="spaceProfile" type="text" list="spaceProfile-list" value="TRAINING LAB" placeholder="Ex.: TRAINING LAB, sala, exterior…" autocomplete="off"><datalist id="spaceProfile-list"><option value="TRAINING LAB"><option value="Sala / estúdio"><option value="Exterior"><option value="Online / casa"><option value="Outro"></datalist>';
 const first=grid.querySelector('.field');if(first)first.insertAdjacentElement('afterend',field);else grid.prepend(field);
 addOption('equipment-list','Automático (TRAINING LAB)');
 addOption('equipment-list','TRX');
 addOption('equipment-list','Barras suspensas');
 addOption('equipment-list','Barra + discos');
 addOption('equipment-list','Kettlebells');
 addOption('equipment-list','Peso corporal');
 const saved=(()=>{try{return JSON.parse(localStorage.getItem(LAB_KEY)||'{}')}catch(e){return{}}})();
 if(saved.spaceProfile)$('spaceProfile').value=saved.spaceProfile;
 else if($('equipment')&&norm($('equipment').value)==='sem equipamento')$('equipment').value='Automático (TRAINING LAB)';
}
function trainingLabInfo(){
 const anchor=$('equipmentMatchStatus')||$('freeFilterHint');if(!anchor||$('trainingLabInfo'))return;
 const box=document.createElement('div');box.id='trainingLabInfo';box.className='storageNote';box.style.marginTop='8px';
 box.innerHTML='<b>TRAINING LAB:</b> base permanente = <b>TRX · barras suspensas · barra + discos · kettlebells · peso corporal</b>. Halteres são complemento: só entram quando os pedes ou quando há vantagem concreta. Regra: <b>objetivo → padrão → exercício → material mínimo</b>, privilegiando transições rápidas, pouca montagem e várias pessoas em simultâneo.';
 anchor.insertAdjacentElement('afterend',box);updateTrainingLabInfo();
}
function updateTrainingLabInfo(){const box=$('trainingLabInfo');if(!box)return;box.style.display=norm($('spaceProfile')?.value).includes('training lab')?'block':'none';}
function persistLab(){try{localStorage.setItem(LAB_KEY,JSON.stringify({spaceProfile:$('spaceProfile')?.value||'',equipment:$('equipment')?.value||''}))}catch(e){}}

function textOf(ex){return norm([ex.name,ex.canonical,ex.family,ex.equipment,ex.region,ex.pattern,ex.objective,ex.notes].join(' '));}
function cat(ex){const t=textOf(ex);
 if(/halter|dumbbell/.test(t))return'dumbbell';
 if(/kettlebell|\bkb\b/.test(t))return'kb';
 if(/barbell|barra|disco/.test(t))return'bar';
 if(/trx|suspensao|suspension/.test(t))return'trx';
 if(/pull.?up|chin.?up|hanging|hang |barra fixa|barra suspensa/.test(t))return'hanging';
 if(/elast|resistance band|miniband|mini band|band /.test(t))return'band';
 if(/step|bosu|slider|medicine ball|med ball|bola|rope|corda/.test(t))return'other';
 return'bodyweight';
}
function labAutoPlan(){const q=norm([$ ('classType')?.value,$('focus')?.value,$('restrictions')?.value].join(' '));
 if(/potencia|power|explos/.test(q))return new Set(['bodyweight','hanging','kb','bar']);
 if(/forca|strength|hipertrof/.test(q))return new Set(['bodyweight','hanging','bar','trx']);
 if(/core|estabil|unilateral|controlo|controle/.test(q))return new Set(['bodyweight','hanging','trx','kb']);
 if(/cardio|conditioning|condicion|metcon|resistencia/.test(q))return new Set(['bodyweight','hanging','kb']);
 if(/mobil|body & mind|along|stretch/.test(q))return new Set(['bodyweight','hanging','trx']);
 return new Set(['bodyweight','hanging','kb','trx']);
}
function isTrainingLab(){return norm($('spaceProfile')?.value).includes('training lab');}
function isAutoLabMaterial(){const e=norm($('equipment')?.value);return !e||/automatico.*training lab|base training lab|training lab/.test(e);}
function labPool(source){
 if(!isTrainingLab()||!Array.isArray(source))return source;
 const explicit=!isAutoLabMaterial();
 if(explicit)return source;
 const allowed=labAutoPlan();
 const out=[];
 for(const ex of source){const c=cat(ex);if(c==='dumbbell')continue;if(allowed.has(c))out.push(ex);}
 return out.length>=8?out:source.filter(ex=>cat(ex)!=='dumbbell');
}
function wrapLabGeneration(){
 ['scratchBtn','scratchFromSuggest'].forEach(id=>{const b=$(id);if(!b||b.dataset.lab104==='1'||typeof b.onclick!=='function')return;const original=b.onclick;b.onclick=function(...args){if(!window.APP?.exercises)return original.apply(this,args);const full=window.APP.exercises;try{window.APP.exercises=labPool(full);return original.apply(this,args)}finally{window.APP.exercises=full;}};b.dataset.lab104='1';});
 if(typeof window.adaptVideo==='function'&&!window.adaptVideo.__lab104){const original=window.adaptVideo;const wrapped=function(...args){if(!window.APP?.exercises)return original.apply(this,args);const full=window.APP.exercises;try{window.APP.exercises=labPool(full);return original.apply(this,args)}finally{window.APP.exercises=full;}};wrapped.__lab104=true;window.adaptVideo=wrapped;}
}
function patchSummary(){const b=$('findBtn');if(!b||b.dataset.labSummary104==='1'||typeof b.onclick!=='function')return;const original=b.onclick;b.onclick=function(...args){const r=original.apply(this,args);setTimeout(()=>{const s=$('filterSummary');if(s&&isTrainingLab())s.innerHTML+=' · <b>TRAINING LAB</b>';},0);return r;};b.dataset.labSummary104='1';}
function versionBadge(){const h=document.querySelector('header h1');if(h)h.textContent='BLUE SYMBIOTE v10.0.4';const sub=document.querySelector('header .sub');if(sub)sub.textContent='instalável · offline · atualização automática · filtros livres · TRAINING LAB · BLUE EDU';}
function bind(){['spaceProfile','equipment','classType','focus','restrictions'].forEach(id=>{const el=$(id);if(!el)return;el.addEventListener('input',()=>{persistLab();updateTrainingLabInfo()});el.addEventListener('change',()=>{persistLab();updateTrainingLabInfo()});});}
function init(){if(!window.APP||!$('config')||!$('equipment')){setTimeout(init,80);return;}addTrainingLabField();trainingLabInfo();bind();wrapLabGeneration();patchSummary();versionBadge();persistLab();console.info('BLUE TRAINING LAB patch '+PATCH_VERSION+' ativo');}
init();
})();