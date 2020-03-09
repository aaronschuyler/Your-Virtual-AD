<template>
  <div id="app">
    <div v-if="this.$store.state.authenticated" id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/organization">Organizations</router-link>
      <!-- <router-link to="/users">Users</router-link>-->
      <!--<router-link to="/regions">Regions</router-link>-->
      <router-link to="/divisions">Divisions</router-link>
      <router-link to="/sports">Sports</router-link>
      <router-link to="/users">Users</router-link>
    </div>
    <div v-else id="nav2">
      <router-link to="/">Home</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  width: 100px;
  height: 100vh;
  background-color: dodgerblue;
  position: fixed;
  top: 0;
  left: 0;
}

#nav a {
  font-weight: bold;
  width: 140px;
  color: #fff;
  display: block;
  margin: 10px 0px;
  background-color: #0056ae;
  padding: 10px;
  transition: all 0.2s;
}

#nav a:hover {
  padding: 15px;
}

#nav a.router-link-exact-active {
  padding: 20px;
  background-color: orangered;
}

.theme-button {
  border: none;
  background-color: white;
  padding: 11px 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

select,
input {
  background-color: #fff;
  margin: 5px;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  position: relative;
  height: 42px;
  min-height: 42px;
  padding-left: 12px;
  padding-right: 12px;
  font-weight: 400;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 14px;
  z-index: 0;
}
</style>
