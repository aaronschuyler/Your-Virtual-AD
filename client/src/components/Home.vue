<template>
  <div class="hello">
    <div>
      <h2>Login</h2>
      <input
        v-if="!this.$store.state.authenticated"
        type="text"
        v-model="username"
      /><br />
      <input
        v-if="!this.$store.state.authenticated"
        type="password"
        v-model="password"
      /><br />
      <button v-if="!this.$store.state.authenticated" @click="login">
        Login
      </button>

      <button @click="logout">logout</button>
      <p v-if="messageBool">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import LoginService from "@/services/LoginService";
//import UserVal from "@/services/UserVal";
import Logout from "@/services/Logout";
export default {
  name: "HelloWorld",
  data() {
    return {
      username: "",
      password: "",
      messageBool: false,
      message: "Your Login Info Is Incorrect, Try Again"
    };
  },
  methods: {
    async login() {
      const res = await LoginService.postLogin({
        username: this.username,
        password: this.password
      });
      if (res == "admin") {
        this.$store.commit("setAuthentication", true);
        //console.log(this.$store.state.authenticated)
        this.$router.push({
          name: "Orgs"
        });
      } else {
        this.messageBool = true;
      }
    },
    // async userVal() {
    //  const res = await UserVal.userVal();
    // },
    async logout() {
      this.$store.commit("setAuthentication", false);
      await Logout.logout();
      //console.log(res)
      //this.$store.commit("setAuthentication", false);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
