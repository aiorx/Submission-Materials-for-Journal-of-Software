// Assisted using common GitHub development utilities
var initializeApp = require('firebase/app').initializeApp;
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// 設定を外部ファイルから取得
var firebaseConfig = require('../firebase-config');

/**
 * Firebase設定
 * あなたのFirebase Consoleから取得した設定情報に置き換えてください
 */
// export const firebaseConfig = {
//   apiKey: "FIREBASE_API_KEY_HERE",
//   authDomain: "FIREBASE_AUTH_DOMAIN_HERE",
//   projectId: "FIREBASE_PROJECT_ID_HERE",
//   storageBucket: "FIREBASE_STORAGE_BUCKET_HERE",
//   messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_HERE",
//   appId: "FIREBASE_APP_ID_HERE"
// };

// Firebase初期化
var app;
var db;
var auth;

// Firebase初期化用の関数
var initializeFirebase = function () {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase初期化完了");
    return true;
  } catch (error) {
    console.error("Firebase初期化エラー:", error);
    return false;
  }
};

// 現在のユーザーがログインしているかチェック
var getCurrentUser = function () {
  return auth.currentUser;
};

// 認証状態の変更を監視
var onAuthStateChange = function (callback) {
  return onAuthStateChanged(auth, callback);
};

// メールとパスワードで新規ユーザー登録
var registerWithEmail = async function (email, password) {
  try {
    var userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
      message: "ユーザー登録が完了しました",
    };
  } catch (error) {
    console.error("ユーザー登録エラー:", error);

    var message = "登録中にエラーが発生しました";
    if (error.code === "auth/email-already-in-use") {
      message = "このメールアドレスは既に使用されています";
    } else if (error.code === "auth/invalid-email") {
      message = "メールアドレスの形式が正しくありません";
    } else if (error.code === "auth/weak-password") {
      message = "パスワードが弱すぎます";
    }

    return {
      success: false,
      message,
    };
  }
};

// メールとパスワードでログイン
var loginWithEmail = async function (email, password) {
  try {
    var userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      user: userCredential.user,
      message: "ログインしました",
    };
  } catch (error) {
    console.error("ログインエラー:", error);

    var message = "ログイン中にエラーが発生しました";
    if (error.code === "auth/invalid-credential") {
      message = "メールアドレスまたはパスワードが正しくありません";
    } else if (error.code === "auth/user-not-found") {
      message = "ユーザーが見つかりません";
    }

    return {
      success: false,
      message,
    };
  }
};

// ログアウト
var logout = async function () {
  try {
    await signOut(auth);
    return {
      success: true,
      message: "ログアウトしました",
    };
  } catch (error) {
    console.error("ログアウトエラー:", error);
    return {
      success: false,
      message: "ログアウト中にエラーが発生しました",
    };
  }
};

// 書籍を追加
var addBookToFirebase = async function (userId, bookData) {
  try {
    if (!db || !userId)
      return {
        success: false,
        message: "Firebaseまたはユーザー認証情報が利用できません",
      };

    // 既存のIDを削除（Firestoreが自動で生成）
    var id = bookData.id;

    // 書籍コレクションに追加
    var booksRef = collection(db, "books");
    var newBook = {
      ...bookWithoutId,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    var docRef = await addDoc(booksRef, newBook);

    return {
      success: true,
      bookId: docRef.id,
      message: "書籍がFirebaseに保存されました",
    };
  } catch (error) {
    console.error("Firebase書籍追加エラー:", error);
    return {
      success: false,
      message: "書籍の保存中にエラーが発生しました",
    };
  }
};

// ユーザーの全書籍を取得
var getAllBooksFromFirebase = async function (userId) {
  try {
    if (!db || !userId)
      return {
        success: false,
        books: [],
        message: "Firebaseまたはユーザー認証情報が利用できません",
      };

    // ユーザーの書籍のみをクエリ
    var booksRef = collection(db, "books");
    var q = query(booksRef, where("userId", "==", userId));
    var querySnapshot = await getDocs(q);

    var books = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      books.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,
        updatedAt: data.updatedAt
          ? data.updatedAt.toDate().toISOString()
          : null,
      });
    });

    return {
      success: true,
      books,
    };
  } catch (error) {
    console.error("Firebase書籍取得エラー:", error);
    return {
      success: false,
      books: [],
      message: "書籍データの取得中にエラーが発生しました",
    };
  }
};

// 書籍を更新
var updateBookInFirebase = async function (bookId, updateData) {
  try {
    if (!db)
      return {
        success: false,
        message: "Firebaseが利用できません",
      };

    // 更新データに更新日時を追加
    var updates = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    // 書籍ドキュメントを更新
    var bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, updates);

    return {
      success: true,
      message: "書籍が更新されました",
    };
  } catch (error) {
    console.error("Firebase書籍更新エラー:", error);
    return {
      success: false,
      message: "書籍の更新中にエラーが発生しました",
    };
  }
};

// 書籍を削除
var deleteBookFromFirebase = async function (bookId) {
  try {
    if (!db)
      return {
        success: false,
        message: "Firebaseが利用できません",
      };

    // 書籍ドキュメントを削除
    var bookRef = doc(db, "books", bookId);
    await deleteDoc(bookRef);

    return {
      success: true,
      message: "書籍が削除されました",
    };
  } catch (error) {
    console.error("Firebase書籍削除エラー:", error);
    return {
      success: false,
      message: "書籍の削除中にエラーが発生しました",
    };
  }
};
