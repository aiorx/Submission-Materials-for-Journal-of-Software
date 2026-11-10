# Built via standard programming aids

import sqlite3

conn = sqlite3.connect('db.db')
cursor = conn.cursor()

# 외래 키 제약 조건 활성화
cursor.execute('PRAGMA foreign_keys = ON;')

# 유저 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS user (
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    nickname TEXT NOT NULL,
    created_at TEXT NOT NULL,
    email TEXT DEFAULT NULL
);
''')

# 기록 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS log (
    user_id TEXT NOT NULL,
    ip TEXT NOT NULL,
    action TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
''')

# 게시판 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS board (
    board_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);
''')

# 게시글 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS post (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    board_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (board_id) REFERENCES board(board_id)
);
''')

# 글 추천 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS post_like (
    post_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    PRIMARY KEY (post_id, user_id)
);
''')

# 글 비추천 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS post_dislike (
    post_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    PRIMARY KEY (post_id, user_id)
);
''')

# 글 댓글 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS comment (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    parent_comment_id INTEGER DEFAULT NULL,
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES comment(comment_id)
);
''')

# 변경사항 저장 및 연결 종료
conn.commit()
conn.close()