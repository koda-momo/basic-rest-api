// index.htmlを読み込んだ時に最初に必要なメソッドを発火
//jsファイルで作成したメソッドの呼び出し.

const indexModule = (() => {
  //usersモジュールの呼び出し
  return usersModule.fetchAllUsers();
})();
