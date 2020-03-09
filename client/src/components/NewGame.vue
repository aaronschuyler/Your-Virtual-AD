<template>
  <div v-if="this.$store.state.authenticated" class="posts">
    <h1>Add Game</h1>
    <div class="form">
      <div>
        <select name="team1" v-model="team1">
          <option value="" disabled selected>Select a Team</option>
          <option
            v-for="team in teams"
            v-bind:value="team.teamName"
            v-bind:key="team.id"
            >{{ team.teamName }}</option
          >
        </select>
      </div>
      <div>
        <select name="team2" v-model="team2">
          <option value="" disabled selected>Select a Team</option>
          <option
            v-for="team in teams"
            v-bind:value="team.teamName"
            v-bind:key="team.id"
            >{{ team.teamName }}</option
          >
        </select>
      </div>
      <div>
        <datetime type="datetime" name="date" v-model="datetime"></datetime>
      </div>
      <div>
        <button class="app_post_btn" @click="addPost">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import PostsService from "@/services/PostsService";
import TeamService from "@/services/TeamService";
import UserVal from "@/services/UserVal";
export default {
  name: "NewPost",
  data() {
    return {
      teams: [],
      team1: "",
      team2: "",
      date1: "",
      time1: "",
      datetime: ""
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "admin") {
        this.$store.commit("setAuthentication", true);
      } else {
        this.$router.push("/");
      }
    },
    async getTeams() {
      const response = await TeamService.fetchTeams();
      this.teams = response.data.teams;
    },
    async addPost() {
      await PostsService.addPost({
        team1: this.team1,
        team2: this.team2,
        date: new Date(this.datetime)
      });
      this.$router.push({
        name: "Games"
      });
    }
  }
};
</script>
<style type="text/css">
.form input,
.form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}

.form div {
}

.app_post_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
