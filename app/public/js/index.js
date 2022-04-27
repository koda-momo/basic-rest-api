// index.htmlを読み込んだ時に最初に必要なメソッドを発火
//jsファイルで作成したメソッドの呼び出し.
const indexModule = (() => {
  /**
   * 検索ボタン押下で呼び出し.
   */
  document.getElementById("search-btn").addEventListener("click", () => {
    return searchModule.searchUsers();
  });
  /**
   * usersモジュールの呼び出し.
   * @remarks 初期表示
   */
  return usersModule.fetchAllUsers();
})();
