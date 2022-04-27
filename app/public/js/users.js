//ユーザ情報用
//モジュール化(usersでのみ使用するものの作成)
const usersModule = (() => {
  //URLの設定
  const BASE_URL = "http://localhost:3000/api/v1/users";

  return {
    //API呼び出し
    fetchAllUsers: async () => {
      //fetch(URL)でGETになる
      const res = await fetch(BASE_URL);
      //JSで扱えるJSON型に変換
      const users = await res.json();
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const body = `<tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.profile}</td>
        <td>${user.date_of_birth}</td>
        <td>${user.created_at}</td>
        <td>${user.updated_at}</td>
        </tr>`;
        //HTMLのid「users-list」のところの後ろに上記を追加
        document
          .getElementById("users-list")
          .insertAdjacentHTML("beforeend", body);
      }
    },
  };
})();
