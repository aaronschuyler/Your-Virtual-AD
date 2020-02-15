<template>
    <div id="app">
        <div id="topbar">
            <table>
                <tr>
                    <td class="td-left">
                        <button class="theme-button one-hundred" @click="showAdd = !showAdd"><span v-if="!showAdd">Add a Team</span><span v-else>X</span></button>
                        <div v-if="showAdd" id="popup-team-select">
                            <select v-model="addSchool">
                                <option value="" disabled selected>Select a School</option>
                                <option v-for="(school, index) in orgs" :value="school.orgName" v-bind:key="index">{{school.orgName}}</option>
                            </select><br><br>
                            <select v-model="addDiv">
                                <option value="" disabled selected>Select a Division</option>
                                <option v-for="(div, index) in divs" :value="div.divName" v-bind:key="index">{{div.divName}}</option>
                            </select><br><br>
                            <select v-model="addSport">
                                <option value="" disabled selected>Select a Sport</option>
                                <option value="Basketball">Basketball</option>

                            </select><br><br>
                            <button class="theme-button" @click="addTeam">Add Team</button></div>

                        <select v-model="team">
                            <option v-for="(team, index) in chosenteams" :value="team" v-bind:key="index">{{team}}</option>
                        </select>
                        <button class="theme-button" @click="removeTeam()">Remove</button>
                    </td>
                    <td class="td-right"><button @click="loginOut" class="theme-button">{{loginLogout}}</button></td>
                    <div v-if="showLogin" id="popup-login">
                        <input type="text" placeholder="username" v-model="username"><br><br>
                        <input type="password" placeholder="password" v-model="password"><br><br>
                        <button class="theme-button" @click="login">Login</button>
                        <p v-if="messageBool">{{message}}</p>
                    </div>
                </tr>
            </table>
        </div>
        <router-view :key="$route.fullPath" />
    </div>
</template>
<script>
    import OrgService from "@/services/OrgService";
    import DivService from "@/services/DivService";
    import LoginService from "@/services/LoginService";
    import Logout from "@/services/Logout";

    export default {
        name: "App",
        data() {
            return {
                team: "",
                orgs: [],
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
                access: this.$store.state.authenticated
            };
        },

        mounted() {
            //this.$cookies.remove("teams")
            this.fetchChosenTeams()
            this.getOrgs()
            this.getDivs()
            this.userVal()
        },
        methods: {
            userVal: function() {
                if (this.$cookies.get("auth") == "true") {
                    this.$store.commit("setAuthentication", true)
                    console.log("coach is logged in")
                }
            },
            async login() {
                if (!this.$store.authenticated) {
                    const res = await LoginService.postLogin({
                        username: this.username,
                        password: this.password
                    });
                    if (res) console.log(res)
                    if (res == "coach") {
                        this.$store.commit("setAuthentication", true)
                        this.$cookies.set("auth", true)
                        this.showLogin = false
                        this.username = ""
                        this.password = ""
                        this.loginLogout = "Logout"
                    } else {
                        this.messageBool = true;
                    }

                }
            },
            loginOut: function() {
                if (this.$store.state.authenticated) {
                    this.logout()
                    this.$cookies.set("auth", false)
                    this.loginLogout = "Login"
                } else {
                    this.showLogin = !this.showLogin
                }
            },
            fetchChosenTeams: function() {
                if (this.$cookies.get("teams") && this.$cookies.get("teams") != null) {
                    this.team = this.$cookies.get("lastTeam")
                    this.chosenteams = JSON.parse(this.$cookies.get("teams"))
                    //console.log(this.$cookies.get("teams"))
                }
            },

            addTeam: function() {
                if (!this.chosenteams.includes(this.addSchool + " " + this.addDiv + " " + this.addSport)) {
                    this.chosenteams.push(this.addSchool + " " + this.addDiv + " " + this.addSport)
                    this.showAdd = !this.showAdd
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
            async logout() {
                this.$store.commit("setAuthentication", false);
                const res = await Logout.logout();
                console.log(res);

            }
        },
        watch: {
            team: function(val) {
                this.$cookies.set("lastTeam", this.team, -1)
                if (this.$route.params.teamName != val) {
                    this.$router.push({
                        name: 'Team',
                        params: {
                            teamName: val
                        }
                    })
                }
            },
            chosenteams: function(val) {

                var json_str = JSON.stringify(val)
                //console.log(json_str)
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
        text-align: center;
    }

    #topbar {
        background: lightblue;
        padding: 10px;
    }

    #topbar table {
        width: 100%;
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
        margin-left: 10px;
        border: none;
        height: 41px;
        background-color: white;
        padding: 11px 13px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 3px;
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    }

    select,
    input {
        margin-left: 10px;
        background-color: #fff;
        -webkit-transition-duration: .3s;
        transition-duration: .3s;
        position: relative;
        height: 42px;
        min-height: 42px;
        padding-left: 12px;
        padding-right: 12px;
        font-weight: 400;
        -webkit-appearance: none;
        outline: none;
        border: 1px solid rgba(0, 0, 0, .2);
        border-radius: 4px;
        font-size: 14px;
        z-index: 0;
    }

</style>
