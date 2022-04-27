//ユーザ情報用
//モジュール化(usersでのみ使用するものの作成)
const usersModule = (() => {
  //URLの設定
  const BASE_URL = "http://localhost:3000/api/v1/users";

  //header(JSONで送る設定)
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  return {
    /**
     * ユーザ情報の取得.
     */
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

    /**
     * ユーザの新規作成.
     */
    createUser: async () => {
      console.dir(
        "送るデータ" + JSON.stringify(document.getElementById("name").value)
      );
      const name = document.getElementById("name").value;
      const profile = document.getElementById("profile").value;
      const dateOfBirth = document.getElementById("date-of-birth").value;

      //POST、PUTで送るリクエスト
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth,
      };

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      const resJson = await res.json();

      //成功したらmessageをアラートで出して、TOPに戻る
      alert(resJson.message);
      window.location.href = "/";
    },
  };
})();
