// Assisted using common GitHub development utilities
import React, { useState, useEffect } from "react";
import { getReadingStats } from "../services/bookService";

const StatisticsPage = () => {
  // 初期状態
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    inProgressBooks: 0,
    totalPages: 0,
    readPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // コンポーネントがマウントされたときに統計情報を読み込む
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const result = await getReadingStats();
        if (result.success) {
          const baseStats = result.stats;
          console.log("読書統計データ:", baseStats); // デバッグログ

          setStats(baseStats);

          setError("");
        } else {
          console.error("統計データの読み込みエラー:", result.message);
          setError(
            result.message || "統計データの読み込み中にエラーが発生しました"
          );
        }
      } catch (err) {
        console.error("統計取得エラー:", err);
        setError("統計データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);
  // 進捗率の計算（将来的な機能拡張用）
  // const completionRate =
  //   stats.totalBooks > 0
  //     ? Math.round((stats.completedBooks / stats.totalBooks) * 100)
  //     : 0;

  return (
    <div>
      <h2 className="page-title">読書統計</h2>
      <p className="page-subtitle">あなたの読書活動の統計情報</p>

      {loading ? (
        <div className="loading-container">
          <p className="loading-message">統計情報を読み込み中...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            再読み込み
          </button>
        </div>
      ) : (
        <div className="stats-container">
          <div className="stats-row">
            <div className="stat-column">
              <div className="stat-box">
                <h3 className="stat-title">合計読了書籍数</h3>
                <p className="stat-large-value">{stats.completedBooks}</p>
                <p className="stat-unit">冊</p>
              </div>
            </div>
            <div className="stat-column">
              <div className="stat-box">
                <h3 className="stat-title">合計読了ページ数</h3>
                <p className="stat-large-value">{stats.readPages}</p>
                <p className="stat-unit">ページ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
