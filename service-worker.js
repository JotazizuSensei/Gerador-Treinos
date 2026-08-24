const VERSION='10.0.8';
const CACHE='blue-symbiote-auto-'+VERSION;
const CORE=['./','./index.html','./manifest.json','./patch-10.0.3.js','./patch-10.0.4.js','./patch-10.0.5.js','./patch-10.0.6.js','./patch-10.0.7.js','./patch-10.0.8.js','./payload-1a.txt','./payload-1b.txt','./payload-1c.txt','./payload-1d.txt','./payload-2a.txt','./payload-2b.txt','./payload-2c.txt','./payload-2d.txt','./payload-3.txt','./payload-4.txt','./icon-180.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}return res;}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}return res;}).catch(async()=>{
    const exact=await caches.match(req);if(exact)return exact;
    const noQuery=await caches.match(new Request(url.origin+url.pathname));if(noQuery)return noQuery;
    return caches.match('./index.html');
  }));
});
