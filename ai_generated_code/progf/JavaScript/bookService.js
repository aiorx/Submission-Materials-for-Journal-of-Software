// Assisted using common GitHub development utilities
/**
 * Firebase Firestore を使用したデータ管理サービス
 * 書籍データ操作の基本関数を提供
 */
import {
  initializeFirebase,
  getCurrentUser,
  addBookToFirebase,
  getAllBooksFromFirebase,
  updateBookInFirebase,
  deleteBookFromFirebase,
} from "./firebaseService";

// ローカルからFirebaseに移行中のフラグ
// ローカルデータを初回のみFirebaseに移行するための変数
let migratedLocalData = false;

// 初期化
initializeFirebase();

// ローカルストレージからデータを取得するヘルパー関数
const getLocalData = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`ローカルストレージからの読み込みエラー (${key}):`, error);
    return defaultValue;
  }
};

// ローカルデータをFirebaseに移行する関数
export const migrateLocalDataToFirebase = async () => {
  try {
    // 既に移行済みまたはユーザーがログインしていなければ処理しない
    const user = getCurrentUser();
    if (migratedLocalData || !user) {
      return { success: false, message: "移行条件が満たされていません" };
    }

    // ローカルストレージから書籍データを取得
    const localBooks = getLocalData("books", []);
    if (localBooks.length === 0) {
      migratedLocalData = true;
      return { success: true, message: "移行するデータがありませんでした" };
    }

    // 各書籍をFirebaseに追加
    for (const book of localBooks) {
      await addBookToFirebase(user.uid, book);
    }

    // 移行完了をマーク
    migratedLocalData = true;
    localStorage.setItem("dataMigrated", "true");

    return {
      success: true,
      message: `${localBooks.length}冊の書籍をFirebaseに移行しました`,
    };
  } catch (error) {
    console.error("データ移行エラー:", error);
    return {
      success: false,
      error: "migration-error",
      message: "データ移行中にエラーが発生しました",
    };
  }
};

// 書籍を追加する
export const addBook = async (bookData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を追加するにはログインが必要です",
      };
    }

    // 新しい書籍データを生成
    const newBook = {
      ...bookData,
      isCompleted: bookData.currentPage >= bookData.totalPages,
      startDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    };

    // Firebaseに保存
    const result = await addBookToFirebase(user.uid, newBook);

    return result;
  } catch (error) {
    console.error("書籍追加エラー:", error);
    return {
      success: false,
      error: "storage-error",
      message: "書籍の保存中にエラーが発生しました",
    };
  }
};

// ユーザーの全書籍を取得する
export const getAllBooks = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を取得するにはログインが必要です",
        books: [],
      };
    }

    // Firebaseからデータを取得
    const result = await getAllBooksFromFirebase(user.uid);

    // 最初の実行時にローカルデータの移行を試みる
    if (!migratedLocalData) {
      const migrationResult = await migrateLocalDataToFirebase();
      console.log("データ移行結果:", migrationResult.message);

      // 移行に成功したら再度データを取得
      if (migrationResult.success) {
        const updatedResult = await getAllBooksFromFirebase(user.uid);
        return updatedResult;
      }
    }

    return result;
  } catch (error) {
    console.error("書籍一覧取得エラー:", error);
    return {
      success: false,
      error: "storage-error",
      message: "書籍データの取得中にエラーが発生しました",
      books: [],
    };
  }
};

// 書籍情報を更新する
export const updateBook = async (bookId, updateData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を更新するにはログインが必要です",
      };
    }

    // 更新データを準備
    const updates = {
      ...updateData,
      lastUpdateDate: new Date().toISOString(),
    };

    // 現在のページが総ページを超えたら完読にする
    if (updates.currentPage >= updates.totalPages) {
      updates.isCompleted = true;
      updates.currentPage = updates.totalPages;
    }

    // Firebaseで更新
    const result = await updateBookInFirebase(bookId, updates);

    // 更新後の書籍データを再取得（UI更新用）
    if (result.success) {
      const booksResult = await getAllBooksFromFirebase(user.uid);
      if (booksResult.success) {
        const updatedBook = booksResult.books.find(
          (book) => book.id === bookId
        );
        if (updatedBook) {
          return {
            success: true,
            book: updatedBook,
            message: "書籍情報が更新されました",
          };
        }
      }
    }

    return result;
  } catch (error) {
    console.error("書籍更新エラー:", error);
    return {
      success: false,
      error: "storage-error",
      message: "書籍データの更新中にエラーが発生しました",
    };
  }
};

// 書籍を削除する
export const deleteBook = async (bookId) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を削除するにはログインが必要です",
      };
    }

    // Firebaseから削除
    const result = await deleteBookFromFirebase(bookId);
    return result;
  } catch (error) {
    console.error("書籍削除エラー:", error);
    return {
      success: false,
      error: "storage-error",
      message: "書籍の削除中にエラーが発生しました",
    };
  }
};

// 読書進捗を更新する
export const updateProgress = async (bookId, currentPage) => {
  return updateBook(bookId, { currentPage });
};

// 読書統計を取得する
export const getReadingStats = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "統計を取得するにはログインが必要です",
        stats: {
          totalBooks: 0,
          completedBooks: 0,
          inProgressBooks: 0,
          totalPages: 0,
          readPages: 0,
        },
      };
    }

    // すべての書籍を取得
    const result = await getAllBooksFromFirebase(user.uid);
    if (!result.success) {
      return {
        success: false,
        error: "storage-error",
        message: "統計データの取得中にエラーが発生しました",
        stats: {
          totalBooks: 0,
          completedBooks: 0,
          inProgressBooks: 0,
          totalPages: 0,
          readPages: 0,
        },
      };
    }

    const books = result.books;

    // 初期値
    const stats = {
      totalBooks: books.length,
      completedBooks: 0,
      inProgressBooks: 0,
      totalPages: 0,
      readPages: 0,
    }; // 書籍データから統計を計算
    books.forEach((book) => {
      const totalPages = book.totalPages || 0;
      const currentPage = book.currentPage || 0;

      stats.totalPages += totalPages;
      stats.readPages += Math.min(currentPage, totalPages);

      // 登録したページ数と読んだページ数が一致している書籍を完読としてカウント
      if (totalPages > 0 && currentPage >= totalPages) {
        stats.completedBooks += 1;
      } else {
        stats.inProgressBooks += 1;
      }
    });

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error("統計取得エラー:", error);
    return {
      success: false,
      error: "storage-error",
      message: "統計データの取得中にエラーが発生しました",
      stats: {
        totalBooks: 0,
        completedBooks: 0,
        inProgressBooks: 0,
        totalPages: 0,
        readPages: 0,
      },
    };
  }
};
