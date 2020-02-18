<template>
  <div v-if="access" class="posts">
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
  <div v-else>Access Denied</div>
</template>

<script>
import PostsService from "@/services/PostsService";
import UserVal from "@/services/UserVal";
export default {
  name: "posts",
  data() {
    return {
      posts: [],
      access: this.$store.state.authenticated
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "admin") {
        this.$store.commit("setAuthentication", true);
      }
    },
    async getPosts() {
      const response = await PostsService.fetchPosts();
      this.posts = response.data.posts;
    },
    async deletePost(id) {
      await PostsService.deletePost(id);
      this.$router.push({
        name: "Games"
      });
      this.getPosts();
    }
  }
};
</script>
<style type="text/css">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}

table th,
table tr {
  text-align: left;
}

table thead {
  background: #f2f2f2;
}

table tr td {
  padding: 10px;
}

table tr:nth-child(odd) {
  background: #f2f2f2;
}

table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}

a {
  color: #4d7ef7;
  text-decoration: none;
}

a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>
