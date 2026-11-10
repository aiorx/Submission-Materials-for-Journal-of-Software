// serviceWorkerRegistration.js
// Assisted using common GitHub development utilities

// このオプションは、サービスワーカーを登録するかどうかを決定します。
// PWAでは本番環境でtrueに設定します。
// ローカル開発中にサービスワーカーを登録するとバグが発生する可能性があるため、
// 開発環境ではデフォルトでfalseに設定されています。
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1]はIPv6のlocalhostアドレスです。
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8はloopbackとして考慮されるIPv4アドレスです。
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // Service Workerを登録するURLを構築
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // PUBLIC_URLが異なるオリジンからのものである場合、
      // Service Workerの登録は機能しません。
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // localhostでの実行時。Service Workerがまだ存在するかどうかを確認します。
        checkValidServiceWorker(swUrl, config);

        // Localhostに追加のログ出力を加えて、開発者にService Worker/PWAの文書への
        // リンクを表示します。
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "このアプリケーションはService Worker（オフラインモード対応）で提供されています。" +
              "より詳しい情報はこちら: https://cra.link/PWA"
          );
        });
      } else {
        // localhostではない場合。Service Workerを単に登録します。
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // この時点で、更新されたプリキャッシュされたコンテンツが
              // 取得され、古いコンテンツは削除されました。
              console.log(
                "新しいコンテンツが利用可能です。アプリを更新するにはページを更新してください。"
              );

              // コールバックを実行
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // この時点で、すべてがプリキャッシュされました。
              // これは「オフライン優先」の使用に最適なタイミングです。
              console.log(
                "コンテンツはオフライン使用のためにキャッシュされました。"
              );

              // コールバックを実行
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Service Workerの登録中にエラーが発生しました:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Service Workerが見つかるかどうかを確認します。見つからない場合はページを更新します。
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Service Workerが存在し、JSファイルが有効であることを確認します。
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // Service Workerが見つからない場合、またはJSでない場合、ページを更新して
        // アプリケーションを再読み込みします。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service Workerが見つかった場合は、通常どおり続行します。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "インターネット接続がありません。アプリはオフラインモードで実行されています。"
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
