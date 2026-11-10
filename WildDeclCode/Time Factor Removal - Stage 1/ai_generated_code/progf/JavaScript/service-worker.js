// service-worker.js
// Assisted using common GitHub development utilities

/* eslint-disable no-restricted-globals */
// Workboxのコアモジュールをインポート
var clientsClaim = require('workbox-core').clientsClaim;
var ExpirationPlugin = require('workbox-expiration').ExpirationPlugin;
var precacheAndRoute = require('workbox-precaching').precacheAndRoute;
var createHandlerBoundToURL = require('workbox-precaching').createHandlerBoundToURL;
var registerRoute = require('workbox-routing').registerRoute;
var StaleWhileRevalidate = require('workbox-strategies').StaleWhileRevalidate;

// Service Workerが制御を即座に取得するように設定
clientsClaim();

// ビルド時に生成されるプリキャッシュマニフェストを使用
// これはwebpack構成によって生成されるマニフェストを使用します
precacheAndRoute(self.__WB_MANIFEST);

// シングルページアプリケーション（SPA）のルーティングを処理
// これにより、ナビゲーションリクエストはindex.htmlに転送されます
var fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // オンライン時にナビゲーションリクエストをindex.htmlに返す
  function ({ request, url }) {
    // ナビゲーションリクエストのみを処理
    if (request.mode !== "navigate") {
      return false;
    }

    // URLにファイル拡張子がある場合はパスと見なさない
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// 画像のキャッシュ戦略を設定
registerRoute(
  // 画像ファイルのみを対象
  function ({ request }) { return request.destination === "image"; },
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // 最大50個、30日間のキャッシュ
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// Firebase関連のAPI呼び出しのキャッシュ戦略
registerRoute(
  function ({ url }) { return url.origin.includes("firebaseio.com") ||
    url.origin.includes("googleapis.com"); },
  new StaleWhileRevalidate({
    cacheName: "firebase-apis",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60, // 1時間
      }),
    ],
  })
);

// CSS、JS、Webフォントのキャッシュ
registerRoute(
  function ({ request }) { return request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"; },
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// Service Worker自体の更新処理
/* eslint-disable no-restricted-globals */
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
