
/* eslint-env browser, serviceworker, es6 */

const cacheList = [
  // '//e.passiontec.cn/component-web/static/comp/1.2.1/index.css',
  // '//www.dpfile.com/app/owl/static/owl_1.7.21.js',
  // '//analytics.meituan.net/analytics.js',
  // '//g.alicdn.com/??secdev/entry/index.js,alilog/oneplus/entry.js',
  // '//avatar.csdnimg.cn/9/E/F/1_someby.jpg',
  // '//csdnimg.cn/search/baidu_opensug-1.0.0.js',
  // '//e.passiontec.cn/account-web/static/img/login_bg1.181ff32.png',
  // '//avatar.csdnimg.cn/B/0/F/1_qq_34190023.jpg',

];
const cacheName = 'pwa-cache-20190301';
console.log(cacheName);
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cacheList.forEach(file => {
        cache.match(file).then(item => {
          if (!item) {
            cache.add(file);
          } else {
            // console.log(item);
          }
        });
      });
    })
  );
});
self.addEventListener("activate", (event) => {
  self.clients.claim();
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (name) {
          if (cacheWhitelist.indexOf(name) === -1) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // 命中缓存，返回缓存内容
        if (response) {
          console.log("哈哈，命中这个缓存啦😝", event.request.url);
          return response;
        }
        const regx = /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/;
        //regx.test(event.request.url)
        if (regx.test(event.request.url)) {
          // 对图片的缓存策略
          const fetchRequest = event.request.clone();
          return fetch(fetchRequest, {
            mode: 'no-cors'
          }).then(
            function (response) {
              console.log(response.type);
              // 得到错误结果就直接返回
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              // 缓存正确结果并返回
              const responseToCache = response.clone();
              caches.open(cacheName)
                .then(function (cache) {
                  cache.put(event.request, responseToCache);
                });
              return response;
            }
          );
        } else {
          return fetch(event.request);
        }
      })
  );
});






