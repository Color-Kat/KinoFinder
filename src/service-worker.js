const staticCacheName = 'static-cache-v0';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
    './',
    './index.html',
    './assets/icons/16x16.png',
    './assets/icons/favicon.ico',
    './assets/icons/72x72.png',
    './assets/icons/96x96.png',
    './assets/icons/144x144.png',
    './assets/icons/128x128.png',
    './assets/icons/152x152.png',
    './assets/icons/192x192.png',
    './assets/icons/512x512.png',
    './manifest.json',
    './index.js',
];

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    // console.log('Service worker has been installed');
});

self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (![staticCacheName, dynamicCacheName].includes(key)) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);
    // console.log('Service worker has been activated');
});

self.addEventListener('fetch', event => {
    // console.log(`Trying to fetch ${event.request.url}`);
    // Не кэшируем файлы для авто обновления страницы
    if (event.request.url.indexOf('sockjs') !== -1 ||
        event.request.url.indexOf('/core') !== -1 ||
        event.request.url.indexOf('/films') !== -1 ||
        event.request.url.indexOf('/serials') !== -1) return;
    event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
    // Пробуем найти это в кэше
    const cachedResponse = await caches.match(req);
    // Возвращаем пользователю либо данные из кэша,
    // либо если их нет, идем в онлайн
    return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);
        if (cachedRes) {
            return cachedRes;
        } else if (req.url.indexOf('.html') !== -1) {
            return caches.match('./asset/offline.html');
        } else {
            return caches.match('./images/no-image.jpg');
        }
    }
}