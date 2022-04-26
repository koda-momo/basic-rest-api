const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const dbPath = "app/db/database.sqlite3";

//URLの設定と返すデータ
/**
 * ユーザ全員の情報を取得.
 */
app.get("/api/v1/users", (req, res) => {
  //DBへの接続
  const db = new sqlite3.Database(dbPath);
  //SQL文
  db.all("SELECT * FROM users;", (err, rows) => {
    res.json(rows);
  });
  db.close();
});

/**
 * ユーザ個人の情報を取得.
 */
app.get("/api/v1/users/:id", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  //URLからIDの取得
  const id = req.params.id;
  //データを全て取得しない場合は「row」
  db.get(`SELECT * FROM users WHERE id = ${id};`, (err, row) => {
    res.json(row);
  });
  db.close();
});

/**
 * 検索.
 */
app.get("/api/v1/search", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const keyword = req.query.q;

  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows);
  });

  db.close();
});

//envに指定があればそれ、無ければ3000でポート立ち上げ
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`ポートが${port}番で立ち上がりました`);
