
var APP_PREFIX = 'clc-dream-garden_'    // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_2024'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
  '/{repository}/',                     // If you have separate JS/CSS files,
  '/{repository}/index.html'            // add path to those files here
]
const URL_TO_CACHE = [
  new RegExp(`^https://script.google.com/macros/.*`),
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  // console.log('fetch request : ' + e.request.url)
  if (URL_TO_CACHE.some((reg) => reg.test(e.request.url))) {
    e.respondWith(handleMatchedRequest(e.request));
  }
})

// Cache resources
self.addEventListener('install', function (e) {
  self.skipWaiting();
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})

async function handleMatchedRequest(request) {
  try {
    const response = await caches.match(request.url);
    return response ? response : doFetch(request);
  } catch (error) {
    console.error('Error fetching matched request:', error);
    return new Response('Something wrong when catching', { status: 500 });
  }
}

async function doFetch(request) {
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.add(request.url);
  return response;
}