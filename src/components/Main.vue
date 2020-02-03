<template>
  <div id="app">
    <header>
      <button v-on:click="goMenu()">설정</button>
      <button v-on:click="logout()">로그아웃</button>
    </header>
    <div id="topbar">
      <ul>
        <li
          v-for="(menu) in menus"
          v-bind:key="menu.idx"
          v-on:click="getLists(menu.idx)"
          :style="{ 'color': currentMenu === menu.idx ? '#fc6e22' : '#808080'}"
        >
          <h3>{{ menu.name }}</h3>
        </li>
      </ul>
    </div>

    <div class="input-form">
      <input type="text" id="input_list" v-on:keyup.enter="createList()" />
      <button v-on:click="createList()">추가</button>
      <button
        id="edit-btn"
        v-on:click="editList()"
        :style="{ 'background-color': isEditMode ? '#ffffff' : '#fc6e22', 
                  'color' : isEditMode ? '#fc6e22' : '#ffffff' }"
      >{{ isEditMode ? '편집 완료' : '편집'}}</button>
    </div>

    <ol>
      <li
        v-for="(list) in lists"
        v-bind:key="list.idx"
        :style="{
        'text-decoration-line':  !isEditMode && list.isChecked ? 'line-through' : 'none',
        'color': isEditMode ? deleteList.indexOf(list) !== -1 ? '#ff0000' : '#00ff00' : list.isChecked ? '#808080' : '#ffffff'}"
        v-on:click="list.isChecked ? uncheckList(list) : checkList(list)"
      >
        <h3>{{ list.content }}</h3>
      </li>
    </ol>

    <footer>
      <div class="dev-info">
        <span v-on:click="goGithub()">
          <img src="../assets/github_logo.png" title="Choi-Jinwoo" />
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import config from "../../config/config.json";
import axios from "axios";

const { SERVER_ADDR } = config;

export default {
  name: "app",
  data() {
    return {
      menus: [],
      lists: [],
      user: {},
      currentMenu: Number,
      isEditMode: false,
      deleteList: []
    };
  },
  mounted() {
    if (!localStorage.getItem("x-access-token")) {
      this.$router.push("/login");
      return;
    }

    axios({
      url: `${SERVER_ADDR}/v1/menu`,
      method: "get",
      headers: {
        "x-access-token": localStorage.getItem("x-access-token")
      }
    })
      .then(resp => {
        const { menus } = resp.data.data;
        this.menus = menus;
        if (menus[0]) {
          this.currentMenu = menus[0].idx;
          this.getLists(this.currentMenu);
        }
      })
      .catch(err => {
        const { status } = err.response;
        if (status === 410 || status === 401) {
          this.$router.push("/login");
          return;
        }

        alert("다시 시도해주세요");
      });
  },
  methods: {
    editList: async function() {
      //편집 모드 진입
      if (!this.isEditMode) {
        this.isEditMode = true;
      } else {
        this.isEditMode = false;
        for (let i = 0; i < this.deleteList.length; i++) {
          try {
            await axios({
              url: `${SERVER_ADDR}/v1/list/${this.deleteList[i].idx}`,
              method: "delete",
              headers: {
                "x-access-token": localStorage.getItem("x-access-token")
              }
            });
          } catch (err) {
            const { status } = err.response;
            if (status === 410 || status === 401) {
              this.$router.push("/login");
              return;
            }

            if (status === 404) {
              alert("이미 삭제된 할일입니다");
              return;
            }

            alert("다시 시도해주세요");
            return;
          }
        }
        this.deleteList = [];
        window.location.href = "./";
      }
    },
    createList: function() {
      const ctx = document.getElementById("input_list").value;

      if (ctx.trim().length === 0) {
        alert("내용을 확인해주세요!");
        return;
      }

      axios({
        url: `${SERVER_ADDR}/v1/list`,
        method: "post",
        headers: {
          "x-access-token": localStorage.getItem("x-access-token")
        },
        data: {
          content: ctx,
          menu_idx: this.currentMenu
        }
      })
        .then(resp => {
          const { list } = resp.data.data;
          this.lists.push(list);
          return;
        })
        .catch(err => {
          const { status } = err.response;
          if (status === 410 || status === 401) {
            this.$router.push("/login");
            return;
          }

          if (status === 400) {
            alert("메뉴 혹은 내용을 확인해주세요");
            return;
          }

          if (status === 404) {
            alert("잘못된 메뉴입니다. 새로고침 후 시도해주세요");
            return;
          }
          alert("다시 시도해주세요");
        });
    },
    getLists: function(idx) {
      this.currentMenu = idx;

      axios
        .get(`${SERVER_ADDR}/v1/list/${idx}`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(resp => {
          const { lists } = resp.data.data;
          this.lists = lists;
        })
        .catch(err => {
          alert(err);
        });
    },
    checkList: function(list) {
      if (this.isEditMode) {
        const idx = this.deleteList.indexOf(list);
        if (idx === -1) {
          this.deleteList.push(list);
          return;
        } else {
          this.deleteList.splice(idx, 1);
        }
        return;
      }
      axios
        .get(`${SERVER_ADDR}/v1/list/check/${list.idx}`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(() => {
          list.isChecked = true;
        })
        .catch(err => {
          alert(err);
        });
    },
    uncheckList: function(list) {
      if (this.isEditMode) {
        const idx = this.deleteList.indexOf(list);
        if (idx === -1) {
          this.deleteList.push(list);
          return;
        } else {
          this.deleteList.splice(idx, 1);
        }
        return;
      }
      axios
        .get(`${SERVER_ADDR}/v1/list/uncheck/${list.idx}`, {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token")
          }
        })
        .then(() => {
          list.isChecked = false;
        })
        .catch(err => {
          alert(err);
        });
    },
    goGithub: function() {
      window.open("https://github.com/Choi-Jinwoo", "newWindow");
    },
    logout: function() {
      localStorage.removeItem("x-access-token");
      this.$router.push("/login");
    },
    goMenu: function() {
      this.$router.push("/menu");
    }
  }
};
</script>

<style>
button:focus {
  outline: none;
}

header {
  margin: 0;
  padding: 0;
  text-align: right;
}

footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 0;
  background-color: #0d0d0d;
  padding-top: 0.6%;
  padding-bottom: 0.6%;
  color: #e2e2e2;
  text-align: right;
}

footer img {
  width: 2%;
  margin-right: 2%;
}

h3,
input {
  margin: 0;
  padding: 0;
}

header button {
  border-radius: 5px;
  margin-top: 1%;
  margin-right: 2%;
  background-color: transparent;
  border: none;
  color: white;
  padding: 0.3%;
}

header button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

#app {
  user-select: none;
}

#topbar {
  margin-left: 15%;
  margin-top: 2%;
  background-color: transparent;
  border-bottom: 2px solid white;
  padding-top: 0.5%;
  padding-bottom: 0.5%;
  width: 70%;
}

#topbar h3:hover {
  color: white;
}

ul {
  display: flex;
  list-style: none;
  margin: 0;
}

ul li {
  margin: 0 auto;
  padding-top: 0;
  color: #fc6e22;
  font-family: "Open Sans", sans-serif;
  cursor: pointer;
}

ol {
  list-style: none;
  margin-bottom: 10%;
}

ol li {
  margin: 0 auto;
  color: white;
  font-family: "Open Sans", sans-serif;
  cursor: pointer;
  padding-bottom: 0.5%;
}

.input-form {
  width: 70%;
  margin: 0 auto;
  text-align: right;
  margin-top: 1%;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 5%;
}

.input-form input[type="text"] {
  width: 20%;
  padding: 0.3% 0;
  border: none;
  background-color: transparent;
  border-bottom: white solid 1px;
  font-size: 14px;
  text-align: center;
  color: #ffffff;
}

.input-form input[type="text"]:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  outline: none;
}

.input-form button {
  outline: none;
  border: none;
  padding: 0.3% 0;
  border-radius: 2px;
  width: 5%;
  color: #ffffff;
  background-color: #fc6e22;
  margin-left: 1%;
}

#edit-btn {
  width: 8%;
}

.input-form button:hover {
  background-color: #c06025;
  cursor: pointer;
}
</style>