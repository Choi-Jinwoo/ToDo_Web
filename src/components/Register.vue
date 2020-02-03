<template>
  <div class="container">
    <img src="../assets/todo_logo.png" width="50" height="50" alt="ToDo" />
    <h1>환영합니다</h1>
    <div class="form">
      <input type="text" name="id" id="id" placeholder="아이디를 입력해주세요" autocomplete="off" />
      <input type="password" name="pw" id="pw" placeholder="비밀번호를 입력해주세요" />
      <input type="password" name="pw_check" id="pw_check" placeholder="비밀번호를 다시 입력해주세요" />
      <input type="text" name="name" id="name" placeholder="이름을 입력해주세요" />
      <button id="button" v-on:click="register">가입완료</button>

      <br />
      <a href="/login">로그인</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../config/config.json";
import { sha512 } from "js-sha512";

const { SERVER_ADDR } = config;

export default {
  methods: {
    register: async function() {
      const idEle = document.getElementById("id");
      const pwEle = document.getElementById("pw");
      const pw_checkEle = document.getElementById("pw_check");
      const nameEle = document.getElementById("name");

      const id = idEle.value;
      const pw = sha512(pwEle.value);
      const pwCheck = sha512(pw_checkEle.value);
      const name = nameEle.value;

      if (pw !== pwCheck) {
        this.$dialogs.alert("비밀번호가 일치하지 않습니다!", {
          title: "회원가입 실패",
          size: "sm"
        });
        return;
      }

      axios
        .post(`${SERVER_ADDR}/v1/auth/register`, {
          id,
          pw,
          name
        })
        .then(() => {
          this.$router.push("/login");
        })
        .catch(err => {
          const { status } = err.response;

          const options = {
            title: "회원가입 실패",
            size: "sm"
          };

          let message;
          switch (status) {
            case 400:
              message = "양식을 확인해주세요!";
              break;
            case 409:
              message = "이미 존재하는 아이디입니다!";
              break;
            default:
              message = "다시 시도해주세요!";
              break;
          }
          this.$dialogs.alert(message, options);
        });
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}

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
#pw,
#pw_check,
#name {
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
#pw:focus,
#pw_check:focus,
#name:focus {
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
</style>
