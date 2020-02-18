<template>
  <div class="posts">
    <h1>Teams</h1>
    <div v-if="teams.length > 0" class="table-wrap">
      <div></div>
      <table>
        <tr>
          <td width="85%">Team</td>
          <td width="15%" align="center">Action</td>
        </tr>
        <tr v-for="team in teams" v-bind:key="team.name">
          <td>
            <router-link
              :to="{ name: 'Team', params: { teamName: team.teamName } }"
              >{{ team.teamName }}</router-link
            >
          </td>
          <td align="center">
            <router-link
              v-bind:to="{ name: 'Team', params: { teamName: team.teamName } }"
              >Edit</router-link
            >
            |
            <a href="#" @click="deleteTeam(team._id)">Delete</a>
          </td>
        </tr>
      </table>
    </div>

    <button @click="newTeam = !newTeam" class="add_post_link">Add Team</button>

    <div v-if="newTeam">
      <input type="text" placeholder="Team Name" v-model="teamName" /><br />
      <input type="text" placeholder="Coach Name" v-model="coach" /><br />
      <input
        type="text"
        placeholder="Organization"
        v-model="organization"
      /><br />
      <button class="app_post_btn" @click="addTeam">Add</button>
    </div>
  </div>
</template>

<script>
import TeamService from "@/services/TeamService";
import UserVal from "@/services/UserVal";
export default {
  name: "teams",
  data() {
    return {
      teams: [],
      newTeam: false,
      teamName: "",
      coach: "",
      organization: ""
    };
  },
  mounted() {
    this.getTeams();
    this.userVal();
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "admin") {
        this.$store.commit("setAuthentication", true);
      }
    },
    async getTeams() {
      const response = await TeamService.fetchTeams();
      this.teams = response.data.teams;
    },
    async deleteTeam(id) {
      await TeamService.deleteTeam(id);
      this.$router.push({
        name: "Teams"
      });
      this.getTeams();
    },
    async addTeam() {
      await TeamService.addTeam({
        teamName: this.teamName,
        coach: this.coach,
        organization: this.organization
      });
      this.newTeam = !this.newTeam;
      this.getTeams();
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
