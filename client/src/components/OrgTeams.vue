<template>
  <div class="org-template">
    <div>
      Add new Schedule for {{ this.$route.params.orgName }}:
      <select style="margin:10px;" v-model="div">
        <option value="" selected>Select a Div</option>
        <option v-for="div in divs" :key="div.divName" :value="div.divName">{{
          div.divName
        }}</option>
      </select>
      <button style="margin:10px;" @click="addTeam()" class="theme-button">
        Add Schedule
      </button>
    </div>
    <div v-if="teams.length > 0">
      <h1>{{ this.$route.params.orgName + " " + this.$route.params.sport }}</h1>
      <div class="team" v-for="(team, index) in teams" :key="team.teamName">
        <table v-if="team.display">
          <tr>
            <td>
              <button
                class="theme-button"
                :class="{ active: viewMode[index] }"
                style="float:left"
                @click="viewModeChange(index)"
              >
                <font-awesome-icon class="blue-icon" icon="calendar-alt" />
              </button>
            </td>
            <td>
              <button
                class="theme-button"
                :class="{ active: !viewMode[index] }"
                style="float:left"
                @click="viewModeChange(index)"
              >
                <font-awesome-icon class="blue-icon" icon="bars" />
              </button>
            </td>
            <th colspan="3">{{ team.teamName }}</th>
            <td>
              <button class="theme-button" @click="addNewGame(index)">
                <font-awesome-icon style="color:dodgerblue;" icon="plus" />
              </button>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr v-if="addGame[index]" class="add">
            <td colspan="2">New Game</td>
            <td>
              <select @change="getGymsForVS()" name="vs" v-model="newGameVS">
                <option value="" disabled selected
                  >Select an Opposing Team</option
                >
                <option v-for="vs in vss" v-bind:value="vs" v-bind:key="vs">{{
                  vs
                }}</option>
              </select>
            </td>
            <td>
              <select name="site" v-model="newGameSite">
                <option value="" disabled selected>Select a Game Site</option>
                <option
                  v-for="gs in gss"
                  v-bind:value="gs.gymName"
                  v-bind:key="gs.gymName"
                  >{{ gs.gymName }}</option
                >
              </select>
            </td>
            <td>
              <div class="tooltip" v-if="dateTipActive">
                {{ dateTip }}
                <a @click="dateTipActive = !dateTipActive">close</a>
              </div>
              <v-date v-model="newGameDate" :disabled-hours="disabledHours" />
            </td>
            <td>
              <button
                class="theme-button"
                @click="addPost(teams[index].teamName, index)"
              >
                <font-awesome-icon style="color:dodgerblue;" icon="plus" />
              </button>
            </td>
          </tr>
        </table>

        <div v-if="!viewMode[index]">
          <table style="margin-bottom:50px;">
            <tr class="labels">
              <td>VS</td>
              <td>Game Site</td>
              <td colspan="2">Date And Time</td>
            </tr>
            <tr v-for="post in posts[index]" :key="post.index">
              <td v-if="post.display">{{ post.team2 }}</td>
              <td v-if="post.display">{{ post.gameSite }}</td>
              <td v-if="post.display">{{ formatDate(post.date) }}</td>
              <td style="text-align:right;">
                <button class="theme-button" @click="deletePost(post._id)">
                  <font-awesome-icon style="color:red;" icon="trash" />
                </button>
              </td>
            </tr>
            <tr></tr>
          </table>
        </div>
        <div v-else>
          <div class="calendar">
            <table>
              <tr>
                <td colspan="2"></td>
              </tr>
              <tr>
                <td valign="top">
                  <table>
                    <tr>
                      <td colspan="7">
                        <a class="arrows" href="#!" @click="stepMonth('down')">
                          &lt; </a
                        >{{ months[month] + " " + year
                        }}<a class="arrows" href="#!" @click="stepMonth('up')">
                          &gt;
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>M</td>
                      <td>T</td>
                      <td>W</td>
                      <td>T</td>
                      <td>F</td>
                      <td>S</td>
                    </tr>
                    <tr
                      v-for="(week, indexx) in calcDates(month, year)"
                      :key="indexx"
                    >
                      <td
                        valign="top"
                        :class="{
                          active:
                            selectedDate.getDate() +
                              '-' +
                              selectedDate.getMonth() +
                              '-' +
                              (selectedDate.getYear() + 1900) ==
                            date + '-' + month + '-' + year
                        }"
                        v-for="(date, indexx) in week"
                        :key="indexx"
                        @click="selectDate(date)"
                      >
                        {{ date }}<br />
                        <span v-if="date">
                          <hr />
                          <span v-for="post in posts[index]" :key="post.index">
                            <div
                              v-if="
                                new Date(post.date).getDate() +
                                  '-' +
                                  new Date(post.date).getMonth() +
                                  '-' +
                                  (new Date(post.date).getYear() + 1900) ==
                                  date + '-' + month + '-' + year
                              "
                              class="bullet"
                            ></div> </span
                        ></span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td valign="top" class="sidebar">
                  <table>
                    <tr>
                      <td colspan="4">
                        {{
                          months[selectedDate.getMonth()] +
                            " " +
                            selectedDate.getDate() +
                            ", " +
                            (selectedDate.getYear() + 1900)
                        }}
                      </td>
                    </tr>
                    <tr v-for="post in posts[index]" :key="post.index">
                      <td v-if="post.display && checkDate(post.date)">
                        {{ post.team2 }}
                      </td>
                      <td v-if="post.display && checkDate(post.date)">
                        {{ post.gameSite }}
                      </td>
                      <td v-if="post.display && checkDate(post.date)">
                        {{ formatDate(post.date) }}
                      </td>
                      <td
                        style="text-align:right;"
                        v-if="post.display && checkDate(post.date)"
                      >
                        <button
                          class="theme-button"
                          @click="deletePost(post._id)"
                        >
                          <font-awesome-icon style="color:red;" icon="trash" />
                        </button>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <br />There are no {{ this.$route.params.sport }} teams at
      {{ this.$route.params.orgName }}
    </div>
  </div>
</template>

<script>
import TeamService from "@/services/TeamService";
import UserVal from "@/services/UserVal";
import PostsService from "@/services/PostsService";
import OrgService from "@/services/OrgService";
import DivsService from "@/services/DivsService";
import SportsService from "@/services/SportsService";
export default {
  name: "OrgTemplate",
  data() {
    return {
      teams: [],
      posts: [],
      orgs: [],
      sports: [],
      divs: [],
      newTeam: {},
      blockedDates: [],
      disabledHours: [1],
      vss: [],
      gss: [],
      div: "",
      addGame: [],
      dateTipActive: false,
      dateTip: "Are you sure you want to schedule two games on the same day?",
      addGameIndex: "",
      newGameDate: "",
      newGameVS: "",
      newGameSite: "",
      opposingTeams: [],
      viewMode: [],
      now: new Date(),
      selectedDate: new Date(),
      month: new Date().getMonth(),
      year: new Date().getYear() + 1900,
      weeks: [],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },

  mounted() {
    this.getSports();
    this.getDivs();
    this.getTeamsByOrg();
    this.userVal();
    this.getTeams();
    this.getOrg();
    this.getSports;
    this.getDivs;
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "admin") {
        this.$store.commit("setAuthentication", true);
      }
    },
    async getDivs() {
      const response = await DivsService.fetchDivs();
      this.divs = response.data.divs;
    },
    async getSports() {
      const response = await SportsService.fetchSports();
      this.sports = response.data.sports;
    },
    async getOrg() {
      const response = await OrgService.getOrg({
        orgName: this.$route.params.orgName
      });
      this.gss = response.data[0].gymLocations;
    },
    async addTeam() {
      await TeamService.addTeam({
        organization: this.$route.params.orgName,
        sport: this.$route.params.sport,
        division: this.div
      });
      this.getTeamsByOrg();
    },
    async getGymsForVS() {
      let obj = this.opposingTeams.find(o => o.teamName === this.newGameVS);
      const response = await OrgService.getOrg({
        orgName: obj.organization
      });
      for (var i = 0; i < response.data[0].gymLocations.length; i++) {
        this.gss.push(response.data[0].gymLocations[i]);
      }
    },
    async getTeamsByOrg() {
      const response = await TeamService.fetchTeamsByOrg({
        orgName: this.$route.params.orgName,
        sport: this.$route.params.sport
      });
      this.teams = response.data.teams;

      var games = [];

      for (var i = 0; i < this.teams.length; i++) {
        const response = await PostsService.fetchPostsByName({
          teamName: this.teams[i].teamName
        });
        this.$set(this.posts, i, response.data.posts);
        this.teams[i].display = true;
        this.addGame[i] = false;

        games[i] = response.data.posts;

        for (var ii = 0; ii < games[i].length; ii++) {
          games[i][ii].display = true;
          if (games[i][ii].team1 !== this.teams[i].teamName) {
            var one = games[i][ii].team1;
            var two = games[i][ii].team2;

            games[i][ii].team2 = one;
            games[i][ii].team1 = two;
          }
        }
      }
      this.posts = games;
    },
    async getTeams() {
      const response = await TeamService.fetchTeams();
      var teams = response.data.teams;
      var filteredTeams = [];
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].organization !== this.$route.params.orgName) {
          filteredTeams.push(teams[i]);
        }
      }
      this.opposingTeams = filteredTeams;
    },
    addNewGame: function(i) {
      this.vss = [];
      var vss = [];
      var blocked = [];
      for (var ix = 0; ix < this.posts[i].length; ix++) {
        blocked.push(new Date(this.posts[i][ix].date));
      }
      this.disabledDates = blocked;
      for (var iix = 0; iix < this.addGame.length; iix++) {
        if (this.addGame[iix] == true) {
          this.$set(this.addGame, iix, false);
        }
      }
      this.$set(this.addGame, i, !this.addGame[i]);
      for (var ii = 0; ii < this.opposingTeams.length; ii++) {
        if (this.opposingTeams[ii].division == this.teams[i].division) {
          vss.push(this.opposingTeams[ii].teamName);
        }
      }
      this.vss = vss;
    },
    async addPost(team1, index) {
      await PostsService.addPost({
        team1: team1,
        team2: this.newGameVS,
        gameSite: this.newGameSite,
        date: new Date(this.newGameDate)
      });
      this.$set(this.addGame, index, false);
      this.getTeamsByOrg();
      this.$set(this.addGame, index, false);
    },
    async deletePost(id) {
      await PostsService.deletePost(id);
      this.getTeamsByOrg();
    },
    formatDate: function(date) {
      let dateTime = new Date(date);
      var hours = dateTime.getHours();
      var stamp = " AM";
      if (hours > 12) {
        hours = hours - 12;
        stamp = " PM";
      } else {
        stamp = " AM";
      }
      return (
        dateTime.getMonth() +
        1 +
        "/" +
        dateTime.getDate() +
        "/" +
        (dateTime.getYear() + 1900) +
        " " +
        hours +
        ":" +
        dateTime.getMinutes() +
        stamp
      );
    },
    stepMonth: function(d) {
      if (d == "up" && this.month <= 10) {
        this.month++;
      } else if (d == "down" && this.month > 0) {
        this.month--;
      } else if (d == "up" && this.month == 11) {
        this.month = 0;
        this.year++;
      } else if (d == "down" && this.month == 0) {
        this.month = 11;
        this.year--;
      }
    },
    selectDate: function(date) {
      this.selectedDate = new Date(this.year, this.month, date);
    },
    calcDates: function(month, year) {
      var start = 1;
      var weeks = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ];
      var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (
        this.year % 4 === 0 ||
        (this.year % 100 === 0 && this.year % 400 === 0)
      ) {
        months[1] = 29;
      }
      var firstDay = new Date();
      firstDay.setMonth(month);
      firstDay.setYear(year + 1900);
      firstDay.setDate(1);
      var beforeFirst = firstDay.getDay() - 1;
      if (beforeFirst == 8) beforeFirst = 0;
      for (var i = 0; i < 6; i++) {
        var multi = i * 7;
        for (var ii = 0; ii < 7; ii++) {
          if (multi == 0 && ii < beforeFirst) {
            weeks[i][ii] = "";
          } else if (start > months[month]) {
            weeks[i][ii] = "";
          } else {
            weeks[i][ii] = start;
            start++;
          }
        }
      }
      if (weeks[5][0] == 0) weeks.length = 5;
      return weeks;
    },
    checkDate: function(d) {
      var date = new Date(d).getDate();
      var year = new Date(d).getYear();
      var month = new Date(d).getMonth();
      if (
        date == this.selectedDate.getDate() &&
        month == this.month &&
        year + 1900 == this.year
      )
        return true;
    },
    viewModeChange: function(index) {
      this.$set(this.viewMode, index, !this.viewMode[index]);
    }
  },
  computed: {},
  watch: {
    newGameDate: function() {
      var d = new Date(this.newGameDate);
      for (var i = 0; i < this.disabledDates.length; i++) {
        if (
          d.getDate() == this.disabledDates[i].getDate() &&
          d.getMonth() == this.disabledDates[i].getMonth() &&
          d.getYear() == this.disabledDates[i].getYear()
        ) {
          this.dateTipActive = true;
        }
      }
    }
  }
};
</script>

<style type="text/css">
a {
  cursor: pointer;
}

.team {
  width: 60%;
  margin: auto;
}

.team table {
  width: 100%;
  text-align: center;
  color: #000;
}

.team table th {
  padding: 15px;
  width: 100%;
  background-color: dodgerblue;
  text-align: center;
}

.labels {
  background: lightblue;
  font-weight: bold;
}

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

.calendar {
  margin: auto;
}

.calendar table {
  margin: none;
  text-align: center;
}

.sidebar {
  width: 40%;
}

.calendar table table:nth-of-type(1) td {
  text-align: center;
  height: 50px;
  width: 50px;
  cursor: pointer;
  border: 1px solid #eee;
}

.arrows {
  color: white;
  font-weight: bolder;
}

.active {
  background-color: dodgerblue;
  color: white;
}

.blue-icon {
  color: dodgerblue;
}

.active .blue-icon {
  color: white !important;
}

.bullet {
  height: 8px;
  width: 8px;
  background-color: orangered;
  border-radius: 50%;
  display: inline-block;
  margin: 5px;
}

td {
  position: relative;
}

.tooltip {
  padding: 10px;
  position: absolute;
  bottom: 60px;
  background: pink;
}
</style>
