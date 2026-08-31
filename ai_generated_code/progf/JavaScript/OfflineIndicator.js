// Supported via standard GitHub programming aids
import React, { useState, useEffect } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

/**
 * オフライン状態を検出して表示するコンポーネント
 * PWA向けにオフライン/オンラインの状態を視覚的に伝える
 */
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine);

  useEffect(() => {
    // オンライン/オフラインイベントのハンドラー
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // 3秒後に表示を消す（オンラインに復帰した場合）
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    // イベントリスナーの登録
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // オンライン状態なら3秒後に非表示
    if (isOnline) {
      const timer = setTimeout(() => setShowIndicator(false), 3000);
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

export default OfflineIndicator;
