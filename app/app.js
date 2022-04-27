//express
const express = require("express");
const app = express();

//SQLite
const sqlite3 = require("sqlite3");
const dbPath = "app/db/database.sqlite3";

//publicディレクトリを静的ファイルとして扱う
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//クライアント側からのリクエストのbodyを読み込む設定
const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

/**
 * ユーザ新規追加.
 */
app.post("/api/v1/users", async (req, res) => {
  //DBへの接続
  const db = new sqlite3.Database(dbPath);

  //登録するデータの作成
  const name = req.body.name;
  const profile = req.body.profile ? req.body.profile : "";
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";

  /**
   * SQL文を受け取ってPOSTするメソッド.
   * @remarks db.runがSQLiteでSQLを実行するメソッド
   * @param sql - 実行するSQL文
   * @returns APIを動かして返すデータ
   */
  const run = async (sql) => {
    //Promise:結果が来るまで待つ
    //reject→失敗
    return new Promise((resolve, reject) => {
      //sqliteのメソッド
      db.run(sql, (err) => {
        if (err) {
          //サーバ側のエラー→500を返す
          res.status(500).send(err);
          return reject();
        } else {
          //成功→messageを返す
          res.json({ message: "新規ユーザを追加しました" });
          return resolve();
        }
      });
    });
  };

  //SQL文(上記のrunメソッドに下記SQL文を渡す)→awaitを付けているのでrunの実行が終わるまで待つ
  await run(
    `INSERT INTO users (name,profile,date_of_birth) VALUES ("${name}","${profile}","${dateOfBirth}");`,
    (err, rows) => {}
  );
  db.close();
});

//envに指定があればそれ、無ければ3000でポート立ち上げ
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`ポートが${port}番で立ち上がりました`);
