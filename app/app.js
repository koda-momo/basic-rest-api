const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const dbPath = "app/db/database.sqlite3";

//URLの設定と返すデータ
app.get("/api/v1/users", (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM users;", (err, rows) => {
    res.json(rows);
  });
  db.close;
});

//envに指定があればそれ、無ければ3000でポート立ち上げ
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`ポートが${port}番で立ち上がりました`);
