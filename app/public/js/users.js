//ユーザ情報用
//モジュール化(usersでのみ使用するものの作成)
const usersModule = (() => {
  //URLの設定
  const BASE_URL = "http://localhost:3000/api/v1/users";

  //header(JSONでサーバ側にデータを送る設定)
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  //error
  const handleError = async (res) => {
    const resJson = await res.json();
    switch (res.status) {
      //成功したらmessageをアラートで出して、TOPに戻る
      case 200:
        alert(resJson.message);
        window.location.href = "/";
        break;

      case 201:
        alert(resJson.message);
        window.location.href = "/";
        break;

      //失敗
      case 400:
        alert(resJson.error);
        break;

      case 404:
        alert(resJson.error);
        break;

      case 500:
        alert(resJson.error);
        break;

      default:
        alert("何かしらのエラーが発生しました");
        break;
    }
  };

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
        <td><a href="edit.html?uid=${user.id}">編集</a></td>
        </tr>`;
        //HTMLのid「users-list」のところの後ろに上記を追加
        document
          .getElementById("users-list")
          .insertAdjacentHTML("beforeend", body);
      }
    },
    /**
     * ユーザ情報を1件取得.
     */
    setExistingValue: async (uid) => {
      const res = await fetch(`${BASE_URL}/${uid}`);
      const resJson = await res.json();
      document.getElementById("name").value = resJson.name;
      document.getElementById("profile").value = resJson.profile;
      document.getElementById("date-of-birth").value = resJson.date_of_birth;
    },
    /**
     * ユーザの新規作成.
     */
    createUser: async () => {
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
        body: JSON.stringify(body), //リクエストをJSON形式で送る
      });
      handleError(res);
    },
    /**
     * ユーザ情報の編集.
     * @params uid - ユーザのID
     */
    saveUser: async (uid) => {
      const name = document.getElementById("name").value;
      const profile = document.getElementById("profile").value;
      const dateOfBirth = document.getElementById("date-of-birth").value;

      //POST、PUTで送るリクエスト
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth,
      };

      const res = await fetch(`${BASE_URL}/${uid}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
      });
      handleError(res);
    },
    /**
     * ユーザ情報の削除.
     * @params uid - ユーザのID
     */
    deleteUser: async (uid) => {
      const ret = window.confirm("このユーザを削除しますか？");

      //「はい」と答えたら実行
      if (ret) {
        const res = await fetch(`${BASE_URL}/${uid}`, {
          method: "DELETE",
          headers: headers,
        });
        handleError(res);
      }
    },
  };
})();
