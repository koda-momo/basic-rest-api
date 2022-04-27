//検索メソッド用
const searchModule = (() => {
  //URLの設定
  const BASE_URL = "http://localhost:3000/api/v1/search";

  return {
    searchUsers: async () => {
      //inputに入力したデータを取得
      const query = document.getElementById("search").value;
      const res = await fetch(`${BASE_URL}?q=${query}`);

      //整形
      const result = await res.json();
      let body = "";
      for (let i = 0; i < result.length; i++) {
        const user = result[i];
        body += `<tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.profile}</td>
        <td>${user.date_of_birth}</td>
        <td>${user.created_at}</td>
        <td>${user.updated_at}</td>
        </tr>`;
      }
      //bodyを置き換え
      document.getElementById("users-list").innerHTML = body;
    },
  };
})();
