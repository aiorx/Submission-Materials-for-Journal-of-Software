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
var migratedLocalData = false;

// 初期化
initializeFirebase();

// ローカルストレージからデータを取得するヘルパー関数
var getLocalData = function (key, defaultValue = null) {
  try {
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("ローカルストレージからの読み込みエラー (" + (key) + "):", error);
    return defaultValue;
  }
};

// ローカルデータをFirebaseに移行する関数
var migrateLocalDataToFirebase = async function () {
  try {
    // 既に移行済みまたはユーザーがログインしていなければ処理しない
    var user = getCurrentUser();
    if (migratedLocalData || !user) {
      return { success: false, message: "移行条件が満たされていません" };
    }

    // ローカルストレージから書籍データを取得
    var localBooks = getLocalData("books", []);
    if (localBooks.length === 0) {
      migratedLocalData = true;
      return { success: true, message: "移行するデータがありませんでした" };
    }

    // 各書籍をFirebaseに追加
    for (var book of localBooks) {
      await addBookToFirebase(user.uid, book);
    }

    // 移行完了をマーク
    migratedLocalData = true;
    localStorage.setItem("dataMigrated", "true");

    return {
      success: true,
      message: "" + (localBooks.length) + "冊の書籍をFirebaseに移行しました",
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
var addBook = async function (bookData) {
  try {
    var user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を追加するにはログインが必要です",
      };
    }

    // 新しい書籍データを生成
    var newBook = {
      ...bookData,
      isCompleted: bookData.currentPage >= bookData.totalPages,
      startDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    };

    // Firebaseに保存
    var result = await addBookToFirebase(user.uid, newBook);

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
var getAllBooks = async function () {
  try {
    var user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を取得するにはログインが必要です",
        books: [],
      };
    }

    // Firebaseからデータを取得
    var result = await getAllBooksFromFirebase(user.uid);

    // 最初の実行時にローカルデータの移行を試みる
    if (!migratedLocalData) {
      var migrationResult = await migrateLocalDataToFirebase();
      console.log("データ移行結果:", migrationResult.message);

      // 移行に成功したら再度データを取得
      if (migrationResult.success) {
        var updatedResult = await getAllBooksFromFirebase(user.uid);
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
var updateBook = async function (bookId, updateData) {
  try {
    var user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を更新するにはログインが必要です",
      };
    }

    // 更新データを準備
    var updates = {
      ...updateData,
      lastUpdateDate: new Date().toISOString(),
    };

    // 現在のページが総ページを超えたら完読にする
    if (updates.currentPage >= updates.totalPages) {
      updates.isCompleted = true;
      updates.currentPage = updates.totalPages;
    }

    // Firebaseで更新
    var result = await updateBookInFirebase(bookId, updates);

    // 更新後の書籍データを再取得（UI更新用）
    if (result.success) {
      var booksResult = await getAllBooksFromFirebase(user.uid);
      if (booksResult.success) {
        var updatedBook = booksResult.books.find(
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
var deleteBook = async function (bookId) {
  try {
    var user = getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "auth-required",
        message: "書籍を削除するにはログインが必要です",
      };
    }

    // Firebaseから削除
    var result = await deleteBookFromFirebase(bookId);
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
var updateProgress = async function (bookId, currentPage) {
  return updateBook(bookId, { currentPage });
};

// 読書統計を取得する
var getReadingStats = async function () {
  try {
    var user = getCurrentUser();
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
    var result = await getAllBooksFromFirebase(user.uid);
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

    var books = result.books;

    // 初期値
    var stats = {
      totalBooks: books.length,
      completedBooks: 0,
      inProgressBooks: 0,
      totalPages: 0,
      readPages: 0,
    }; // 書籍データから統計を計算
    books.forEach((book) => {
      var totalPages = book.totalPages || 0;
      var currentPage = book.currentPage || 0;

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
