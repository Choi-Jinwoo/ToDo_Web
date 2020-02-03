<template>
  <div id="menu-ctrl">
    <div id="left-bar">
      <img src="../assets/todo_logo.png" width="30px" height="30px" v-on:click="goMain()" />
      <div id="func-con">
        <div id="add-con">
          추가
          <br />
          <input type="text" id="add-input" v-on:keyup.enter="createMenu()" />
          <button v-on:click="createMenu()">완료</button>
        </div>
        <div id="modify-con">
          수정
          <br />
          <input
            type="text"
            id="modify-input"
            :placeholder="this.currentMenu.name!== 'Object' ? this.currentMenu.name : ''"
            v-on:keyup.enter="modifyMenu"
          />
          <button v-on:click="modifyMenu()">완료</button>
        </div>
        <div id="delete-con">
          <button id="delete-btn" v-on:click="deleteMenu()">삭제</button>
          {{ this.currentMenu.name!== 'Object' ? this.currentMenu.name : '' }}
        </div>
      </div>
    </div>
    <div id="card-con">
      <div
        id="card"
        v-for="(menu) in menus"
        v-bind:key="menu.idx"
        v-on:click="selectCard(menu)"
        :style="{ 'background-color': currentMenu === menu ? '#fc6e22' : '#ffffff',
                  'color': currentMenu === menu ? '#ffffff' : '#fc6e22' } "
      >{{ menu.name }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../config/config.json";
const { SERVER_ADDR } = config;

export default {
  name: "app",
  data() {
    return {
      menus: [],
      currentMenu: Object
    };
  },
  mounted() {
    if (!localStorage.getItem("x-access-token")) {
      this.$router.push("/login");
      return;
    }

    axios
      .get(`${SERVER_ADDR}/v1/menu`, {
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
      .then(resp => {
        const { menus } = resp.data.data;
        if (menus[0]) {
          this.currentMenu = menus[0].idx;
        }
        this.menus = menus;
      })
      .catch(err => {
        alert(err);
      });
  },
  methods: {
    selectCard: function(menu) {
      this.currentMenu = menu;
    },
    deleteMenu: function() {
      const menu = this.currentMenu;

      if (!menu.idx) {
        alert("메뉴를 선택해주세요!");
        return;
      }
      if (!confirm("삭제 시 모든 목록도 삭제 됩니다.")) return;
      axios({
        url: `${SERVER_ADDR}/v1/menu/${menu.idx}`,
        method: "delete",
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        }
      })
        .then(() => {
          window.location.href = "./menu";
        })
        .catch(err => {
          const { status } = err.response;
          if (status === 410 || status === 401) {
            this.$router.push("/login");
            return;
          }

          if (status === 404) {
            alert("새로 고침 후 다시시도 해주세요");
            return;
          }

          alert("다시 시도해주세요");
        });
    },
    modifyMenu: function() {
      const menu = this.currentMenu;
      const menuName = document.getElementById("modify-input").value;

      if (!menu.idx) {
        alert("메뉴를 선택해주세요!");
        return;
      }

      if (menuName.trim().length === 0) {
        alert("내용을 입력해주세요");
        return;
      }

      axios({
        url: `${SERVER_ADDR}/v1/menu/${menu.idx}`,
        method: "put",
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        },
        data: {
          name: menuName
        }
      })
        .then(() => {
          menu.name = menuName;
        })
        .catch(err => {
          const { status } = err.response;
          if (status === 410 || status === 401) {
            this.$router.push("/login");
            return;
          }

          if (status === 404) {
            alert("새로 고침 후 다시시도 해주세요");
            return;
          }

          if (status === 400) {
            alert("내용을 확인해주세요");
            return;
          }

          alert("다시 시도해주세요");
        });
    },
    createMenu: function() {
      const menuName = document.getElementById("add-input").value;

      if (menuName.trim().length === 0) {
        alert("내용을 입력해주세요");
        return;
      }

      axios({
        url: `${SERVER_ADDR}/v1/menu`,
        method: "post",
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        },
        data: {
          name: menuName
        }
      })
        .then(() => {
          window.location.href = "./menu";
        })
        .catch(err => {
          const { status } = err.response;
          if (status === 410 || status === 401) {
            this.$router.push("/login");
            return;
          }

          if (status === 400) {
            alert("내용을 확인해주세요");
            return;
          }

          alert("다시 시도해주세요");
        });
    },
    goMain: function() {
      this.$router.push("/");
    }
  }
};
</script>

<style>
h2 {
  margin: 0;
  padding: 0;
}

#left-bar img {
  cursor: pointer;
  margin-top: 5%;
}

#left-bar {
  position: fixed;
  width: 20%;
  background-color: #0d0d0d;
  box-shadow: 3px 1px 10px 2px #000000;
  height: 100%;
  left: 0;
}

#func-con {
  text-align: left;
  margin-top: 20%;
  color: #fc6e22;
}

#func-con input[type="text"] {
  width: 70%;
  margin-top: 15%;
  border: none;
  background-color: transparent;
  border-bottom: 1.5px solid #fc6e22;
  padding: 2%;
  color: #0d0d0d;
  margin-right: 4%;
  text-align: center;
}

#func-con input[type="text"]:focus {
  outline: none;
}

#func-con button {
  padding: 2%;
  border: none;
  outline: none;
  width: 15%;
  background-color: #fc6e22;
  border-radius: 4px;
  color: white;
}

#func-con button:hover {
  background-color: #c06025;
  cursor: pointer;
}

#add-con,
#modify-con {
  padding: 5%;
  border-radius: 3px;
  background-color: white;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20%;
}

#card-con {
  right: 0;
  position: absolute;
  margin-top: 10%;
  width: 80%;
  margin-bottom: 5%;
}

#card {
  color: #fc6e22;
  float: left;
  width: 15%;
  background-color: #eeeeee;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 5%;
  padding-top: 2%;
  padding-bottom: 2%;
  border-radius: 5px;
}

#card:hover {
  cursor: pointer;
}

#delete-con {
  margin-left: 5%;
}

#delete-btn {
  margin-right: 20%;
}
</style>