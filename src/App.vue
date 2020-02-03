<template>
  <div id="app">
    <router-view v-on:click="moveToLogin()">메인페이지</router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    moveToLogin: function() {
      this.$router.push("/main");
    }
  }
};
</script>

<style>
#app {
  text-align: center;
  font-family: "Gothic A1", sans-serif;
  margin: 0;
  padding: 0;
}

body {
  background-color: #282c34;
}
</style>
