// index.htmlを読み込んだ時に最初に必要なメソッドを発火
//jsファイルで作成したメソッドの呼び出し.
const indexModule = (() => {
  //現在のパス(URL)を取得
  const path = window.location.pathname;

  switch (path) {
    case "/":
      /**
       * 検索ボタン押下で呼び出し.
       */
      document.getElementById("search-btn").addEventListener("click", () => {
        return searchModule.searchUsers();
      });

      /**
       * 初期表示用データ取得.
       */
      return usersModule.fetchAllUsers();

    case "/create.html":
      /**
       * ユーザの新規追加.
       */
      document.getElementById("save-btn").addEventListener("click", () => {
        return usersModule.createUser();
      });
      /**
       * キャンセルボタン押下.
       */
      document.getElementById("cancel-btn").addEventListener("click", () => {
        return (window.location.href = "/");
      });
      break;

    case "/edit.html":
      //URLからid取得
      const uid = window.location.search.split("?uid=")[1];

      /**
       * ユーザ情報編集.
       */
      document.getElementById("save-btn").addEventListener("click", () => {
        return usersModule.saveUser(uid);
      });
      /**
       * 削除ボタン押下.
       */
      document.getElementById("delete-btn").addEventListener("click", () => {
        return usersModule.deleteUser(uid);
      });
      /**
       * 初期情報取得.
       */
      return usersModule.setExistingValue(uid);
      break;

    default:
      break;
  }
})();
