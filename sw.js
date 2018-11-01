self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('simply-edit-pwa-cache').then(function(cache) {
			return cache.addAll([
				'https://hnpwa.simplyedit.io/',
				'/manifest.json',
//				'/camil_512x512.png',
//				'/camil_192x192.png',
//				'/camil_32x32.png',
				'https://cdn.simplyedit.io/1/simply-edit.js',
				'https://api.hackerwebapp.com/news',
//				'https://api.hackerwebapp.com/newest',
//				'https://api.hackerwebapp.com/show',
//				'https://api.hackerwebapp.com/ask',
//				'https://api.hackerwebapp.com/jobs'
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