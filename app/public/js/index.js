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

    default:
      break;
  }
})();
