// Supported via standard GitHub programming aids
var _import = require('react');
var FiWifi = require('react-icons/fi').FiWifi;
var FiWifiOff = require('react-icons/fi').FiWifiOff;

/**
 * オフライン状態を検出して表示するコンポーネント
 * PWA向けにオフライン/オンラインの状態を視覚的に伝える
 */
var OfflineIndicator = function () {
  var [isOnline, setIsOnline] = useState(navigator.onLine);
  var [showIndicator, setShowIndicator] = useState(!navigator.onLine);

  useEffect(() => {
    // オンライン/オフラインイベントのハンドラー
    var handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // 3秒後に表示を消す（オンラインに復帰した場合）
      setTimeout(() => setShowIndicator(false), 3000);
    };

    var handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    // イベントリスナーの登録
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // オンライン状態なら3秒後に非表示
    if (isOnline) {
      var timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    }

    // クリーンアップ関数
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  // インジケーターを表示する必要がない場合は何もレンダリングしない
  if (!showIndicator) return null;

  return (
    <div className="offline-indicator">
      {isOnline ? (
        <>
          <FiWifi />
          <span>インターネット接続が回復しました</span>
        </>
      ) : (
        <>
          <FiWifiOff />
          <span>オフラインモードで動作中</span>
        </>
      )}
    </div>
  );
};

module.exports = OfflineIndicator;
