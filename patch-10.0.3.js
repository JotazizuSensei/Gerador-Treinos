(()=>{
'use strict';
const PATCH_VERSION='10.0.3';
const FILTER_KEY='blue_symbiote_filters_v10_3';
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const words=s=>norm(s).split(/[^a-z0-9+]+/).filter(Boolean);
const KNOWN_TYPES=['Mobilidade','Mobilidade + Core','Body & Mind','Core','Mix Training','Functional Training','Primal-inspired'];

function labelFor(id,text){const el=$(id);const field=el?.closest('.field');const lab=field?.querySelector('label');if(lab)lab.textContent=text;}
function combo(id,items,placeholder='Escreve ou escolhe…'){
 const old=$(id);if(!old||old.dataset.free==='1')return old;
 const value=old.value;
 const input=document.createElement('input');
 input.id=id;input.type='text';input.value=value;input.placeholder=placeholder;input.setAttribute('list',id+'-list');input.autocomplete='off';input.dataset.free='1';
 const dl=document.createElement('datalist');dl.id=id+'-list';items.forEach(v=>{const o=document.createElement('option');o.value=v;dl.appendChild(o)});
 old.replaceWith(input);input.insertAdjacentElement('afterend',dl);return input;
}
function numberInput(id,min,max,step){const old=$(id);if(!old||old.tagName==='INPUT')return old;const v=old.value;const input=document.createElement('input');input.id=id;input.type='number';input.min=min;input.max=max;input.step=step;input.value=v;old.replaceWith(input);return input;}
function addHint(){
 const grid=$('classType')?.closest('.grid');if(!grid||$('freeFilterHint'))return;
 const div=document.createElement('div');div.id='freeFilterHint';div.className='storageNote';div.style.marginTop='10px';div.innerHTML='<b>Filtros livres:</b> podes escolher uma sugestão ou escrever outra opção. Em <b>Material / equipamento</b>, termos como “elásticos”, “barra”, “halteres”, “TRX”, “step”, “bola”, etc. são interpretados pela criação BLUE. <b>Adaptações individuais em aula ficam a cargo do treinador.</b>';
 grid.insertAdjacentElement('afterend',div);
 const st=document.createElement('div');st.id='equipmentMatchStatus';st.className='small';st.style.marginTop='6px';div.insertAdjacentElement('afterend',st);
}
function neutralizeClinicalUI(){
 labelFor('specialGroup','Perfil da turma');
 labelFor('equipment','Material / equipamento');
 labelFor('focus','Foco / objetivo');
 labelFor('supports','Apoios / organização');
 const r=$('restrictions');if(r){const lab=r.parentElement?.querySelector('label');if(lab)lab.textContent='Contexto geral da aula';r.placeholder='Ex.: sem saltos, pouco espaço, turma cansada, circuito por estações, foco potência…';}
 const good=document.querySelector('#config .goodbox');if(good)good.innerHTML='<b>Fluxo correto:</b> defines a aula que precisas. Os filtros principais são <b>editáveis</b>: podes escolher uma sugestão ou escrever outra opção. A app cruza modalidade, duração, dificuldade, perfil da turma, material, impacto, foco e contexto para criar ou adaptar a sessão.';
}
function makeFiltersFree(){
 combo('classType',['Mobilidade','Mobilidade + Core','Body & Mind','Core','Mix Training','Functional Training','Primal-inspired','Força','Condicionamento','Cardio funcional','Alongamentos','Mobilidade dinâmica'],'Ex.: Mobilidade + Core');
 numberInput('duration','10','120','5');
 combo('specialGroup',['Geral','Iniciantes','Intermédio','Avançado','Sénior / 60+','Low Impact','Misto'],'Ex.: Geral, Iniciantes, Misto…');
 combo('equipment',['Sem equipamento','Colchonetes','Elásticos','Mini band','Banda elástica longa','Barra','Barra + discos','Halteres','1 haltere / peso','Kettlebell','TRX','Step','Bola','Medicine ball','Sliders','Bosu','Leve variado'],'Ex.: elásticos, barra, TRX, halteres…');
 combo('impact',['Baixo','Médio','Alto','Variável'],'Ex.: Baixo, Médio…');
 combo('focus',['Full body','Core','Anca / membros inferiores','Ombro / torácica','Cadeia posterior','Coordenação / controlo','Glúteos','Força','Potência','Mobilidade','Resistência'],'Ex.: full body, glúteos, potência…');
 combo('supports',['Não','Sim','Conforme necessário','Estações'],'Ex.: Não, Estaçōes…');
 neutralizeClinicalUI();addHint();
}

function textOf(ex){return norm([ex.name,ex.canonical,ex.family,ex.equipment,ex.region,ex.pattern,ex.objective,ex.notes].join(' '));}
function eqProfile(q){
 const n=norm(q);
 if(!n||/^(sem equipamento|nenhum|peso corporal|bodyweight)$/.test(n))return {kind:'none',terms:[]};
 if(/elast|band|miniband|mini band/.test(n))return{kind:'band',terms:['elast','band','resistance','miniband','mini band']};
 if(/barra|barbell/.test(n))return{kind:'bar',terms:['barra','barbell']};
 if(/halter|dumbbell/.test(n))return{kind:'dumbbell',terms:['halter','dumbbell']};
 if(/kettlebell|\bkb\b/.test(n))return{kind:'kb',terms:['kettlebell',' kb ']};
 if(/trx|suspens/.test(n))return{kind:'trx',terms:['trx','suspens']};
 if(/step/.test(n))return{kind:'step',terms:['step']};
 if(/slider|desliz/.test(n))return{kind:'slider',terms:['slider','desliz']};
 if(/bosu/.test(n))return{kind:'bosu',terms:['bosu']};
 if(/medicine|med ball/.test(n))return{kind:'medball',terms:['medicine ball','med ball']};
 if(/bola|ball/.test(n))return{kind:'ball',terms:['bola',' ball ']};
 if(/corda|rope/.test(n))return{kind:'rope',terms:['corda','rope']};
 return{kind:'custom',terms:words(n).filter(w=>w.length>2)};
}
function inferredFor(ex,kind){const t=textOf(ex);
 if(kind==='band')return /row|remada|pallof|abduc|lateral walk|glute|rotacao externa|external rotation|pull apart|press|shoulder|ombro/.test(t);
 if(kind==='bar')return /squat|agach|deadlift|hinge|good morning|row|remada|press|lunge|thruster|clean|snatch|hip thrust/.test(t);
 if(kind==='dumbbell')return /squat|lunge|row|press|deadlift|hinge|thruster|carry|curl|raise|elevacao/.test(t);
 if(kind==='trx')return /row|squat|lunge|hamstring|plank|press|core|balance/.test(t);
 if(kind==='step')return /step|lunge|squat|calf|cardio/.test(t);
 if(kind==='slider')return /mountain climber|lunge|hamstring|plank|pike|knee tuck/.test(t);
 if(kind==='ball'||kind==='medball')return /throw|slam|twist|squat|lunge|press|core|crunch|bridge/.test(t);
 return false;
}
function explicitEq(ex,p){const t=textOf(ex);return p.terms.some(x=>t.includes(norm(x)));}
function obviousLoaded(ex){return /kettlebell|barbell|barra|halter|dumbbell|medicine ball|med ball|trx|bosu|slider|elast|band|peso|load|disco/.test(textOf(ex));}
function semanticMatch(ex,q){
 const n=norm(q),t=textOf(ex);if(!n)return false;
 const alias=[];
 if(/mobil|along|stretch|flexib/.test(n))alias.push('mobil','stretch','flexib','cars','rotation','rotacao','wave','opener');
 if(/core|abdom/.test(n))alias.push('core','plank','dead bug','hollow','crunch','rotation','anti');
 if(/forca|strength/.test(n))alias.push('squat','lunge','deadlift','hinge','press','row','pull','push','clean','thruster');
 if(/cardio|condicion|hiit|metcon/.test(n))alias.push('burpee','jump','skater','high knees','mountain climber','conditioning','metcon');
 if(/glut/.test(n))alias.push('glute','bridge','hip thrust','abduc','hinge','lunge');
 if(/perna|inferior|lower/.test(n))alias.push('squat','lunge','hinge','hamstring','glute','calf','ankle');
 if(/superior|upper|braco/.test(n))alias.push('press','row','push','pull','shoulder','ombro','scap');
 if(alias.length&&alias.some(a=>t.includes(norm(a))))return true;
 return words(n).filter(w=>w.length>3).some(w=>t.includes(w));
}
function buildAdaptiveExercises(){
 const original=window.APP?.exercises||[];if(!original.length)return original;
 let candidates=original.slice();
 const type=$('classType')?.value||'';const focus=$('focus')?.value||'';const eq=$('equipment')?.value||'';
 if(type&&!KNOWN_TYPES.includes(type)){
   const m=candidates.filter(ex=>semanticMatch(ex,type));if(m.length>=6)candidates=m;
 }
 const builtInFocus=['Full body','Core','Anca / membros inferiores','Ombro / torácica','Cadeia posterior','Coordenação / controlo'];
 if(focus&&!builtInFocus.includes(focus)){
   const m=candidates.filter(ex=>semanticMatch(ex,focus));if(m.length>=5)candidates=m;
 }
 const p=eqProfile(eq);
 if(p.kind==='none'){
   const m=candidates.filter(ex=>!obviousLoaded(ex));if(m.length>=8)candidates=m;
 }else if(p.kind!=='custom'||p.terms.length){
   const direct=[],support=[];
   for(const ex of candidates){const hit=explicitEq(ex,p)||inferredFor(ex,p.kind);if(hit){const c={...ex};if(!explicitEq(ex,p)&&eq)c.equipment=eq;direct.push(c)}else if((ex.family==='Mobilidade'||ex.family==='Body & Mind')&&!obviousLoaded(ex))support.push(ex);}
   if(direct.length>=3)candidates=[...direct,...support.slice(0,Math.max(4,Math.ceil(direct.length*.25)))];
 }
 return candidates.length?candidates:original;
}
function updateEquipmentStatus(){const el=$('equipmentMatchStatus');if(!el||!window.APP?.exercises)return;const q=$('equipment')?.value||'';const p=eqProfile(q);if(!q){el.textContent='';return;}let n=0;for(const ex of window.APP.exercises)if(p.kind==='none'?!obviousLoaded(ex):(explicitEq(ex,p)||inferredFor(ex,p.kind)))n++;
 el.textContent=p.kind==='none'?`Material: sem equipamento — biblioteca filtrada para movimentos sem carga externa.`:n>=3?`Material reconhecido: ${q} — ${n} exercícios/variações compatíveis ou adaptáveis encontrados na biblioteca.`:`Material livre: ${q}. A app usa-o como contexto; se houver poucas etiquetas específicas, mantém a programação e deixa a execução/equipamento editável.`;
}
function withAdaptivePool(fn){return function(...args){if(!window.APP?.exercises)return fn.apply(this,args);const original=window.APP.exercises;try{window.APP.exercises=buildAdaptiveExercises();return fn.apply(this,args)}finally{window.APP.exercises=original;}}}
function wrapGeneration(){
 ['scratchBtn','scratchFromSuggest'].forEach(id=>{const b=$(id);if(!b||b.dataset.adaptive==='1')return;const original=b.onclick;if(typeof original==='function'){b.onclick=withAdaptivePool(original);b.dataset.adaptive='1';}});
 if(typeof window.adaptVideo==='function'&&!window.adaptVideo.__adaptive){const original=window.adaptVideo;const wrapped=withAdaptivePool(original);wrapped.__adaptive=true;window.adaptVideo=wrapped;}
}
function persistFilters(){const ids=['classType','duration','specialGroup','groupSize','difficulty','equipment','impact','focus','supports','flowRule','warmup','importMode','restrictions'];const obj={};ids.forEach(id=>{if($(id))obj[id]=$(id).value});try{localStorage.setItem(FILTER_KEY,JSON.stringify(obj))}catch(e){}}
function restoreFilters(){let obj={};try{obj=JSON.parse(localStorage.getItem(FILTER_KEY)||'{}')||{}}catch(e){};for(const [id,v] of Object.entries(obj)){if($(id)&&v!=null){if(id==='specialGroup'&&/punho|joelho|ombro|dor|lesao|patolog/i.test(norm(v)))continue;$(id).value=v;}}if($('difficultyValue')&&$('difficulty'))$('difficultyValue').textContent=$('difficulty').value;}
function bindPersistence(){const ids=['classType','duration','specialGroup','groupSize','difficulty','equipment','impact','focus','supports','flowRule','warmup','importMode','restrictions'];ids.forEach(id=>{const el=$(id);if(!el)return;el.addEventListener('input',()=>{persistFilters();if(id==='equipment')updateEquipmentStatus()});el.addEventListener('change',()=>{persistFilters();if(id==='equipment')updateEquipmentStatus()});});}
function patchSuggestionButton(){const b=$('findBtn');if(!b||b.dataset.freePatched==='1')return;const original=b.onclick;if(typeof original!=='function')return;b.onclick=function(e){const sg=$('specialGroup');const typed=sg?.value||'';const known=['Geral','Sénior / 60+','Iniciantes','Low Impact'];if(sg&&!known.includes(typed))sg.value='Geral';try{return original.call(this,e)}finally{if(sg)sg.value=typed;setTimeout(()=>{const s=$('filterSummary');if(s&&typed&&!known.includes(typed))s.innerHTML+=` · perfil: <b>${typed.replace(/[<>]/g,'')}</b>`;},0)}};b.dataset.freePatched='1';}
function versionBadge(){const h=document.querySelector('header h1');if(h)h.textContent='BLUE SYMBIOTE v10.0.3';const sub=document.querySelector('header .sub');if(sub)sub.textContent='instalável · offline · atualização automática · filtros livres · BLUE EDU';}

function init(){
 if(!window.APP||!$('config')){setTimeout(init,60);return;}
 makeFiltersFree();restoreFilters();bindPersistence();wrapGeneration();patchSuggestionButton();updateEquipmentStatus();versionBadge();
 console.info('BLUE filter patch '+PATCH_VERSION+' ativo');
}
init();
})();