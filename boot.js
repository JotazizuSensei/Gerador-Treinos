(async()=>{try{
const ungzip=async b64=>{const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(stream).text();};
const dataB64=[window.__BLUE_DATA_1,window.__BLUE_DATA_2,window.__BLUE_DATA_3].filter(Boolean).join('');
window.APP=JSON.parse(await ungzip(dataB64));
window.APP_READY=Promise.resolve(window.APP);
const codeB64=[window.__BLUE_CODE_1,window.__BLUE_CODE_2,window.__BLUE_CODE_3].filter(Boolean).join('');
const code=await ungzip(codeB64);
(new Function('APP',code))(window.APP);
}catch(e){console.error('Falha ao iniciar BLUE Symbiote',e);document.body.innerHTML='<main style="padding:24px;font-family:Arial"><h2>BLUE Symbiote</h2><p>Falha ao iniciar a aplicação.</p><pre>'+String(e)+'</pre></main>';}})();
