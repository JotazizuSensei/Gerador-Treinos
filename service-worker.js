const VERSION='10.0.2';
const CACHE='blue-symbiote-atomic-'+VERSION;
const CORE=['./','./index.html','./manifest.json','./payload-1.txt','./payload-2a.txt','./payload-2b.txt','./payload-2c.txt','./payload-2d.txt','./payload-3.txt','./payload-4.txt','./icon-180.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
    if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
    return res;
  }).catch(()=>caches.match(req).then(hit=>hit||caches.match('./index.html'))));
});
