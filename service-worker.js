let cacheName = "city-pwa-v1";
let cacheDataName = "city-pwa-data-v1";
let filesToCache = [
	'index.html',
	'apiKeys.js',
	'main.js?v=1',
	'theme.css?v=1'
];



self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if(key != cacheName) {
					caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener("fetch", (e) => {
	if(!e.request.url.includes(location.origin)) {
		caches.open(cacheDataName).then((cache) => {
			return fetch(e.request).then((response) => {
				cache.put(e.request, response);
			});
		})
	}
	e.respondWith(
		caches.match(e.request).then((response) => {
			return response || fetch(e.request);
		})
	);
});