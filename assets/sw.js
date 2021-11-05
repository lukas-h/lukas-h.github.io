---
layout: none
permalink: "sw.js"
---

const version = '{{ site.time | date: '%Y%m%d%H%M%S' }}';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return [
    {% for post in site.posts limit: 50 %}
      "{{ site.baseurl }}{{ post.url }}",
    {% endfor %}
    {% for page in site.pages %}
      {% unless page.url contains 'sw.js' or page.url contains '404.html' or page.url contains '.xml' %}
        "{{ site.baseurl }}{{ page.url }}",
      {% endunless %}
    {% endfor %}
  ]
};

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    return Promise.all(
      keys
      .filter(key => {
        return key !== cacheName;
      })
      .map(key => {
        console.log(`Service Worker: removing cache ${key}`);
        return caches.delete(key);
      })
    );
  });
};

self.addEventListener("install", event => {
  console.log('Service Worker registered.');
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  if (url.origin !== location.origin) {
    return;
  }

  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  let offline = "/offline.html";

  if (request.url.match(/\.(jpe?g|png|gif|svg|tiff?)$/)) {
    offline = "/uploads/sample.jpg";
  }
  event.respondWith(
    fetch(request)
      .catch(async () => {
      return (await caches.match(request)) || caches.match(offline);
    })
  );
  return;
});