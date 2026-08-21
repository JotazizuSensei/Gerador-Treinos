const VERSION='10.0.1';
const CACHE='blue-symbiote-'+VERSION;
const CORE=['./','./index.html','./manifest.json?v='+VERSION,'./styles.css?v='+VERSION,'./boot.js?v='+VERSION,'./ui-1.txt?v='+VERSION,'./ui-2.txt?v='+VERSION,'./data-1.txt?v='+VERSION,'./data-2.txt?v='+VERSION,'./data-3.txt?v='+VERSION,'./data-4.txt?v='+VERSION,'./data-5.txt?v='+VERSION,'./data-6.txt?v='+VERSION,'./data-7.txt?v='+VERSION,'./code-1.txt?v='+VERSION,'./code-2.txt?v='+VERSION,'./code-3.txt?v='+VERSION,'./code-4.txt?v='+VERSION,'./code-5.txt?v='+VERSION,'./code-6.txt?v='+VERSION,'./code-7.txt?v='+VERSION,'./icon-180.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;
 if(r.mode==='navigate'){
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));return;
 }
 e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r)));
});
