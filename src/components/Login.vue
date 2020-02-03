<template>
  <div class="container">
    <img src="../assets/todo_logo.png" width="50" height="50" alt="ToDo" />
    <h1>안녕하세요</h1>
    <div class="form">
      <input type="text" name="id" id="id" placeholder="아이디를 입력해주세요" autocomplete="off" />
      <input type="password" name="pw" id="pw" placeholder="비밀번호를 입력해주세요" v-on:keyup.enter="login" />
      <button id="button" v-on:click="login">로그인</button>
    </div>
    <a id="sign-up" v-on:click="moveRegisterPage">아직 계정이 없으신가요?</a>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../config/config.json";
import { sha512 } from "js-sha512";
const { SERVER_ADDR } = config;

export default {
  methods: {
    login: async function() {
      const idEle = document.getElementById("id");
      const pwEle = document.getElementById("pw");

      const id = idEle.value;
      const pw = sha512(pwEle.value);

      axios
        .post(`${SERVER_ADDR}/v1/auth/login`, {
          id,
          pw
        })
        .then(resp => {
          localStorage.setItem(
            "x-access-token",
            resp.data.data["x-access-token"]
          );
          this.$router.push("/");
        })
        .catch(err => {
          const { status } = err.response;

          const options = {
            title: "로그인 실패",
            size: "sm"
          };

          let message;
          switch (status) {
            case 400:
              message = "양식을 확인해주세요!";
              break;
            case 401:
              message = "아이디, 비밀번호가 일치하지 않습니다!";
              break;
            default:
              message = "다시 시도해주세요!";
              break;
          }
          this.$dialogs.alert(message, options);
        });
    },
    moveRegisterPage: function() {
      this.$router.push("/register");
    }
  }
};
</script>

<style>
.container {
  margin-top: 5%;
  text-align: center;
  color: #fc6e22;
}

.container a {
  font-family: "to+Sans+KR", sans-serif;
  font-size: 60%;
  color: white;
}

.form {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2%;
  border-radius: 10px;
}

#id,
#pw {
  border: none;
  border-bottom: 1.3px solid white;
  background-color: transparent;
  font-family: "Open Sans", sans-serif;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5%;
  padding: 0.5%;
  width: 50%;
  color: white;
}

#id:focus,
#pw:focus {
  outline: none;
}

#button {
  font-size: 110%;
  font-weight: bold;
  margin-top: 5%;
  width: 30%;
  padding-top: 0.8%;
  padding-bottom: 0.8%;
  border: none;
  border-radius: 10px;
  background-color: #fc6e22;
  color: white;
  margin-bottom: 1%;
}

#button:hover {
  cursor: pointer;
}

#sign-up:hover {
  cursor: pointer;
}
</style>
