self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('simply-edit-pwa-cache-2')
		.then(function(cache) {
			return cache.addAll([
				'https://hnpwa.dev.muze.nl/',
				'/manifest.json',
				'https://cdn.simplyedit.io/1/1.26/simply-edit.js',
				'https://cdn.simplyedit.io/1/1.26/simply/databind.js?v=1.26',
				'https://api.hackerwebapp.com/news?page=1',
				'/styles.css',
				'/js/simplyview/dist/simply.everything.js',
				'/favicon-32x32.png',
				'/android-chrome-192x192.png'
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (
		event.request.url.match(/\/api.hackerwebapp.com\//)
	) {
		/* Network then cache for hackerwebapp data */
		event.respondWith(
			fetch(event.request).catch(function() {
				return caches.match(event.request);
			})
		);
		return;
	}
	
	/* Cache then network for simplyedit and ourselves. */
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});