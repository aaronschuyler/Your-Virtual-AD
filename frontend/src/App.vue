<template>
  <div id="app">
    <div id="topbar">
      <div class="container-fluid">
        <div class="row">
          <div v-if="chosenteams.length" class="col-10 text-left">
            <button
              v-if="!access"
              class="theme-button"
              @click="showAdd = !showAdd"
            >
              <span v-if="!showAdd">Add a Team</span><span v-else>X</span>
            </button>
            <div v-if="showAdd" id="popup-team-select">
              <select v-model="addSchool">
                <option value="" disabled selected>Select a School</option>
                <option
                  v-for="(school, index) in orgs"
                  :value="school.orgName"
                  v-bind:key="index"
                  >{{ school.orgName }}</option
                > </select
              ><br /><br />
              <select v-model="addDiv">
                <option value="" disabled selected>Select a Division</option>
                <option
                  v-for="(div, index) in divs"
                  :value="div.divName"
                  v-bind:key="index"
                  >{{ div.divName }}</option
                > </select
              ><br /><br />
              <select v-model="addSport">
                <option value="" disabled selected>Select a Sport</option>
                <option
                  v-for="(sport, index) in sports"
                  :value="sport.sport"
                  v-bind:key="index"
                  >{{ sport.sport }}</option
                > </select
              ><br /><br />
              <button class="theme-button" @click="addTeam(true)">
                Add Team
              </button>
            </div>

            <select v-model="team">
              <option
                v-for="(team, index) in chosenteams"
                :value="team"
                v-bind:key="index"
                >{{ team }}</option
              >
            </select>
            <button v-if="!access" class="theme-button" @click="removeTeam()">
              Remove
            </button>
          </div>
          <div v-else class="col-6 text-left my-auto">
            <h1 class="my-auto">Your Team Page</h1>
          </div>
          <div class="col text-right">
            <button @click="loginOut" class="theme-button">
              {{ loginLogout }}
            </button>
          </div>
          <div v-if="showLogin" id="popup-login">
            <input
              type="text"
              placeholder="username"
              v-model="username"
            /><br /><br />
            <input
              type="password"
              placeholder="password"
              v-model="password"
            /><br /><br />
            <button class="theme-button" @click="login">Login</button>
            <p v-if="messageBool">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!chosenteams.length" class="container-fluid ">
      <div class="row landing">
        <div class="col my-auto  text-center">
          <h2>Select your team!</h2>
          <select v-model="addSchool">
            <option value="" disabled selected>Select a School</option>
            <option
              v-for="(school, index) in orgs"
              :value="school.orgName"
              v-bind:key="index"
              >{{ school.orgName }}</option
            >
          </select>
          <select v-model="addDiv">
            <option value="" disabled selected>Select a Division</option>
            <option
              v-for="(div, index) in divs"
              :value="div.divName"
              v-bind:key="index"
              >{{ div.divName }}</option
            >
          </select>
          <select v-model="addSport">
            <option value="" disabled selected>Select a Sport</option>
            <option
              v-for="(sport, index) in sports"
              :value="sport.sport"
              v-bind:key="index"
              >{{ sport.sport }}</option
            >
          </select>
          <button class="theme-button" @click="addTeam(false)">Add Team</button>
        </div>
      </div>
    </div>
    <router-view v-else :key="$route.fullPath" />
    <div class="container-fluid ">
      <div class="row footer">
        <div class="col text-center my-auto">
          <p>&copy; 2020 Your Virtual AD</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrgService from "@/services/OrgService";
import DivService from "@/services/DivService";
import LoginService from "@/services/LoginService";
import TeamService from "@/services/TeamService";
import SportsService from "@/services/SportsService";
import Logout from "@/services/Logout";
import UserVal from "@/services/UserVal";

export default {
  name: "App",
  data() {
    return {
      team: "",
      orgs: [],
      sports: [],
      chosenteams: [],
      addSchool: "",
      addDiv: "",
      addSport: "",
      divs: [],
      showAdd: false,
      showLogin: false,
      username: "",
      password: "",
      message: "Username or password is incorrect. Try again.",
      messageBool: false,
      loginLogout: "Login",
      access: false,
      coachOrg: ""
    };
  },

  mounted() {
    // this.$cookies.remove("teams")
    //  this.$cookies.remove("lastTeam")
    if (this.chosenteams.length < 0) this.$cookies.remove("lastTeam");
    this.fetchChosenTeams();
    this.getOrgs();
    this.getDivs();
    this.getSports();
    this.userVal();
    if (this.access) this.getTeamsByOrg();
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "coach" || res.data.accessLevel == "rep") {
        this.$store.commit("setAuthentication", true);
        this.access = this.$store.state.authenticated;
        this.$store.commit("setOrg", this.$cookies.get("org"));
        this.coachOrg = this.$store.state.org;
        this.loginLogout = "Logout";
      }
    },
    async login() {
      if (!this.$store.authenticated) {
        const res = await LoginService.postLogin({
          username: this.username,
          password: this.password
        });
        if (res.accessLevel == "coach" || res.accessLevel == "rep") {
          this.$store.commit("setAuthentication", true);
          this.access = this.$store.state.authenticated;
          this.$cookies.set("auth", true);
          this.showLogin = false;
          this.username = "";
          this.password = "";
          this.loginLogout = "Logout";
          this.$cookies.remove("teams");
          this.coachOrg = res.organization;
          this.$store.commit("setOrg", res.organization);
          this.$cookies.set("org", res.organization);
          this.getTeamsByOrg(1);
        } else {
          this.messageBool = true;
        }
      }
    },
    loginOut: function() {
      if (this.$store.state.authenticated) {
        this.logout();
        this.$cookies.set("auth", false);
        this.loginLogout = "Login";
        this.$cookies.remove("teams");
        this.$cookies.remove("lastTeam");
        this.chosenTeams = [];
      } else {
        this.showLogin = !this.showLogin;
      }
    },
    fetchChosenTeams: function() {
      if (this.$cookies.get("teams") && this.$cookies.get("teams") != null) {
        this.team = this.$cookies.get("lastTeam");
        this.chosenteams = JSON.parse(this.$cookies.get("teams"));
      }
    },
    async getTeamsByOrg(val) {
      const response = await TeamService.fetchTeamsByOrgOnly({
        orgName: this.coachOrg
      });
      var teams = [];

      for (var i = 0; i < response.data.teams.length; i++) {
        teams[i] = response.data.teams[i].teamName;
      }

      this.chosenteams = teams;
      if (val == 1) {
        this.$router.push({
          name: "Team",
          params: {
            teamName: this.chosenteams[0]
          }
        });
        this.team = this.chosenteams[0];
      }
    },
    addTeam: function(val) {
      if (
        !this.chosenteams.includes(
          this.addSchool + " " + this.addDiv + " " + this.addSport
        )
      ) {
        var team = this.addSchool + " " + this.addDiv + " " + this.addSport;
        this.chosenteams.push(team);
        if (val) this.showAdd = !this.showAdd;
        this.team = team;
        this.$router.push({
          name: "Team",
          params: {
            teamName: team
          }
        });
      }
    },
    async getOrgs() {
      const response = await OrgService.fetchOrgs();
      var orgs = response.data.orgs;
      this.orgs = orgs;
    },
    async getDivs() {
      const response = await DivService.fetchDivs();
      var divs = response.data.divs;
      this.divs = divs;
    },
    async getSports() {
      const response = await SportsService.fetchSports();
      var sports = response.data.sports;
      this.sports = sports;
    },
    async logout() {
      this.$store.commit("setAuthentication", false);
      this.access = this.$store.state.authenticated;
      this.$cookies.remove("teams");
      this.$cookies.remove("lastTeam");
      this.chosenteams = [];
      this.team = "";
      this.$router.push("/");
      await Logout.logout();
    },
    removeTeam: function() {
      var team = this.team;
      var teams = this.chosenteams.filter(function(e) {
        return e !== team;
      });
      this.chosenteams = teams;
      if (teams[0]) {
        this.$router.push({
          name: "Team",
          params: {
            teamName: teams[0]
          }
        });
        this.team = teams[0];
      } else {
        this.$router.push("/");
      }
    }
  },
  watch: {
    team: function(val) {
      this.$cookies.set("lastTeam", this.team, -1);
      if (this.$route.params.teamName != val) {
        this.$router.push({
          name: "Team",
          params: {
            teamName: val
          }
        });
      }
    },
    chosenteams: function(val) {
      var json_str = JSON.stringify(val);

      this.$cookies.set("teams", json_str, -1);
    }
  }
};
</script>
<style>
#app {
  font-family: arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-weight: bold;
  color: white;
  font-family: impact;
}

h2 {
  color: white;
}

h3 {
  margin: 10px;
}

#topbar {
  background: #00a7e5;
  padding: 10px;
  border-bottom: 1px #eee solid;
}

#topbar table {
  width: 100%;
}

.landing {
  height: 90vh;
  background-image: url(assets/sports.svg);
  background-size: cover;
}

.footer {
  background: #00a7e5;
  border-top: 1px #eee solid;
  height: 10vh;
  color: white;
  position: relative;
  z-index: 10;
}

.td-left {
  text-align: left;
}

.td-right {
  text-align: right;
}

#popup-team-select {
  position: absolute;
  text-align: left;
  background: silver;
  padding: 20px;
  margin-top: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  z-index: 100;
}

#popup-team-select:before {
  content: " ";
  position: absolute;
  left: 30px;
  top: -15px;
  border-top: none;
  border-right: 15px solid transparent;
  border-left: 15px solid transparent;
  border-bottom: 15px solid silver;
}

#popup-login {
  position: absolute;
  text-align: left;
  right: 10px;
  top: 100px;
  background: silver;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  z-index: 100;
}

#popup-login:before {
  content: " ";
  position: absolute;
  right: 30px;
  top: -15px;
  border-top: none;
  border-right: 15px solid transparent;
  border-left: 15px solid transparent;
  border-bottom: 15px solid silver;
}

.one-hundred {
  width: 100px;
}

.theme-button {
  margin: 10px;
  border: none;
  height: 41px;
  line-height: normal;
  background-color: white;
  padding: 0px 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

select,
input,
textarea {
  margin: 10px !important;
  background-color: #fff;
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
