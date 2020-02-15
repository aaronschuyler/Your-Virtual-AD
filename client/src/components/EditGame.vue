<template>
  <div class="posts">
    <h1>Edit Game</h1>
    <div class="form">
      <div>
        <input type="text" name="title" placeholder="team1" v-model="team1" />
        <input type="text" name="title" placeholder="team2" v-model="team2" />
      </div>
    </div>
    <div>
      <button class="app_post_btn" @click="updatePost">Update</button>
    </div>
  </div>
</template>

<script>
import PostsService from "@/services/PostsService";
import UserVal from "@/services/UserVal";
export default {
  name: "EditPost",
  data() {
    return {
      team1: "",
      team2: ""
    };
  },
  mounted() {
    this.getPost();
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "admin") {
        this.$store.commit("setAuthentication", true);
      } else {
        console.log("user is not authenticated");
      }
    },
    async getPost() {
      const response = await PostsService.getPost({
        id: this.$route.params.id
      });
      this.team1 = response.data.team1;
      this.team2 = response.data.team2;
    },
    async updatePost() {
      await PostsService.updatePost({
        id: this.$route.params.id,
        team1: this.team1,
        team2: this.team2
      });
      this.$router.push({ name: "Games" });
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
