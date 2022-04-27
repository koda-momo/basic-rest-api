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

/**
 * SQL文を受け取って発動させるするメソッド.
 * @remarks db.runがSQLiteでSQLを実行するメソッド
 * @param sql - 実行するSQL文
 * @returns APIを動かして返すデータ
 */
const run = async (sql, db) => {
  //Promise:結果が来るまで待つ
  //reject→失敗
  return new Promise((resolve, reject) => {
    //sqliteのメソッド
    db.run(sql, (err) => {
      if (err) {
        //失敗したらこのerrがcatchに入る
        return reject(err);
      } else {
        //成功→messageを返す
        return resolve();
      }
    });
  });
};

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
    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).send({ error: "ユーザが見つかりません" });
    }
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
    if (rows) {
      res.status(200).json(rows);
    } else {
      res.status(404).send({ error: "ユーザが見つかりません" });
    }
  });

  db.close();
});

/**
 * ユーザ新規追加.
 */
app.post("/api/v1/users", async (req, res) => {
  if (!req.body.name || req.body.name == "") {
    res.status(400).send({ error: "ユーザ名が指定されていません" });
  } else {
    //DBへの接続
    const db = new sqlite3.Database(dbPath);
    //登録するデータの作成
    const name = req.body.name;
    const profile = req.body.profile ? req.body.profile : "";
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";

    try {
      //SQL文(上記のrunメソッドに下記SQL文を渡す)→awaitを付けているのでrunの実行が終わるまで待つ
      await run(
        `INSERT INTO users (name,profile,date_of_birth) VALUES ("${name}","${profile}","${dateOfBirth}");`,
        db
      );
      res.status(201).send({ message: "新規ユーザを登録しました" });
    } catch (e) {
      res.status(500).send({ error: e });
    }
    db.close();
  }
});

/**
 * ユーザ情報編集.
 */
app.put("/api/v1/users/:id", async (req, res) => {
  //DBへの接続
  const db = new sqlite3.Database(dbPath);

  //編集するユーザのID
  const id = req.params.id;

  //現在のユーザ情報を取得
  db.get(`SELECT * FROM users WHERE id = ${id};`, async (err, row) => {
    if (row) {
      //登録するデータの作成
      const name = req.body.name ? req.body.name : row.name;
      const profile = req.body.profile ? req.body.profile : row.profile;
      const dateOfBirth = req.body.date_of_birth
        ? req.body.date_of_birth
        : row.date_of_birth;

      //SQL文(上記のrunメソッドに下記SQL文を渡す)→awaitを付けているのでrunの実行が終わるまで待つ
      try {
        await run(
          `UPDATE users SET name="${name}",profile="${profile}",date_of_birth="${dateOfBirth}" WHERE id = "${id}";`,
          db
        );
        res.status(200).send({ message: "ユーザ情報を更新しました" });
      } catch (e) {
        res.status(500).send({ error: e });
      }
    } else {
      res.status(404).send({ error: "指定されたユーザが見つかりません" });
    }
  });
  db.close();
});

/**
 * ユーザ削除.
 */
app.delete("/api/v1/users/:id", async (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id = ${id};`, async (err, row) => {
    if (row) {
      try {
        await run(`DELETE FROM users WHERE id=${id}`, db);
        res.status(200).send({ message: "ユーザーを削除しました。" });
      } catch (e) {
        res.status(500).send({ error: e });
      }
    } else {
      res.status(404).send({ error: "指定されたユーザが見つかりません" });
    }
  });

  db.close();
});

//envに指定があればそれ、無ければ3000でポート立ち上げ
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`ポートが${port}番で立ち上がりました`);
