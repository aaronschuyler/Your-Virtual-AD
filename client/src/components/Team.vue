<template>
  <div class="posts">
    <h1>Games</h1>
    <div v-if="posts.length > 0" class="table-wrap">
      <div>
        <router-link v-bind:to="{ name: 'NewGame' }" class=""
          >Add Game</router-link
        >
      </div>
      <table>
        <tr>
          <td>Team 1</td>
          <td>Team 2</td>
          <td width="500px">Date</td>
          <td width="100" align="center">Action</td>
        </tr>
        <tr v-for="post in posts" v-bind:key="post.date">
          <td>{{ post.team1 }}</td>
          <td>{{ post.team2 }}</td>
          <td>{{ post.date }}</td>
          <td align="center">
            <router-link
              v-bind:to="{ name: 'EditGame', params: { id: post._id } }"
              >Edit</router-link
            >
            |
            <a href="#" @click="deletePost(post._id)">Delete</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      There are no games.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'NewGame' }" class="add_post_link"
        >Add Game</router-link
      >
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
      posts: [],
      title: "",
      description: ""
    };
  },
  mounted() {
    this.getPosts();
    this.userVal();
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
    async getPosts() {
      const response = await PostsService.fetchPostsByName({
        teamName: this.$route.params.teamName
      });

      this.posts = response.data.posts;
    },
    async deletePost(id) {
      await PostsService.deletePost(id);
      this.$router.push({ name: "Games" });
      this.getPosts();
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
