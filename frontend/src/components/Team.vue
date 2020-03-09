<template>
    <div class="org-template">
        <div class="hero" :style="{ backgroundImage: 'url(' + heroImageURL + ')' }">
            <h1>{{ this.$route.params.teamName }}</h1>
            <button v-if="this.$store.state.authenticated" class="theme-button" @click="editHero = !editHero">
                Edit Image
            </button>
            <div v-if="!editHero" class="upload">
                <input type="file" id="file" ref="file" @change="upFunc(0)" /><button @click="submitFile(0)">
                    submit
                </button>
            </div>
        </div>
        <div v-if="published || auth" class="team">
            <div class="container-fluid">
                <div class="row blue-row">
                    <div class="col-2">
                        <button class="theme-button" :class="{ active: !viewMode }" style="float:left" @click="viewModeChange">
                            <font-awesome-icon class="blue-icon" icon="calendar-alt" />
                        </button>
                        <button class="theme-button" :class="{ active: viewMode }" style="float:left" @click="viewModeChange">
                            <font-awesome-icon class="blue-icon" icon="bars" />
                        </button>
                    </div>
                    <div class="col-8 my-auto row-heading">Schedule</div>
                </div>
            </div>

            <div v-if="viewMode">
                <div class="container-fluid data-rows" style="margin-bottom:50px;">
                    <div class="table-top row labels">
                        <div class="col my-auto">VS</div>
                        <div class="col my-auto">Game Site</div>
                        <div class="col my-auto">Date And Time</div>
                        <div class="col my-auto">Home/Away</div>
                    </div>
                    <div class="row list" v-for="(post, index) in posts" :key="index">
                        <div class="col my-auto">{{ post.team2 }}</div>
                        <div class="col my-auto">{{ post.gameSite }}</div>
                        <div class="col my-auto">{{ formatDate(post.date) }}</div>
                        <div class="col my-auto">
                            <span v-if="post.home">
                                Home<br /><a v-if="!auth" @click="toVol(post._id, index, post.date)" style="color: #00a7e5;">Volunteer</a></span><span v-else>Away</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="calendar">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col"></div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <table>
                                    <tr class="table-top">
                                        <td colspan="7">
                                            <a class="arrows" @click="stepMonth('down')"> &lt; </a>{{ months[month] + " " + year
                      }}<a class="arrows" @click="stepMonth('up')">
                                                &gt;
                                            </a>
                                        </td>
                                    </tr>
                                    <tr class="days">
                                        <td>S</td>
                                        <td>M</td>
                                        <td>T</td>
                                        <td>W</td>
                                        <td>T</td>
                                        <td>F</td>
                                        <td>S</td>
                                    </tr>
                                    <tr class="dates" v-for="(week, indexx) in calcDates(month, year)" :key="indexx">
                                        <td valign="top" :class="{
                        active:
                          selectedDate.getDate() +
                            '-' +
                            selectedDate.getMonth() +
                            '-' +
                            (selectedDate.getYear() + 1900) ==
                          date + '-' + month + '-' + year
                      }" v-for="(date, indexx) in week" :key="indexx" @click="selectDate(date)">
                                            <span class="date-number">{{ date }}</span><br />
                                            <span v-if="date">
                                                <hr />

                                                <span v-for="(post, index) in posts" :key="index">
                                                    <div v-if="
                              new Date(post.date).getDate() +
                                '-' +
                                new Date(post.date).getMonth() +
                                '-' +
                                (new Date(post.date).getYear() + 1900) ==
                                date + '-' + month + '-' + year
                            " class="bullet"></div>
                                                </span>
                                                <span v-for="practice in team.practice" :key="practice.date">
                                                    <div v-if="
                              new Date(practice.date).getDate() +
                                '-' +
                                new Date(practice.date).getMonth() +
                                '-' +
                                (new Date(practice.date).getYear() + 1900) ==
                                date + '-' + month + '-' + year
                            " class="bullet-blue"></div>
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="sidebar col">
                                <transition name="slide">
                                    <div v-if="showVol" class="volunteer-form">
                                        <input type="text" placeholder="name" v-model="volunteer.name" />
                                        <input type="text" placeholder="phone" v-model="volunteer.phone" />
                                        <input type="text" placeholder="email" v-model="volunteer.email" />
                                        <select v-model="volunteer.position">
                                            <option value="" selected disabled>Choose a role..</option>
                                            <option value="Admissions">Admissions</option>
                                            <option value="Concessions">Concessions</option>
                                            <option value="Bookkeeper">Bookkeeper</option>
                                            <option value="Clockkeeper">Clockkeeper</option>
                                            <option value="Game Personnel">Game Personnel</option>
                                        </select>
                                        <button class="theme-button" @click="submitVolunteer(index)">
                                            Submit
                                        </button>
                                    </div>
                                </transition>
                                <transition name="slide">
                                    <div v-if="showPracticeForm && auth" class="volunteer-form">
                                        <h3>
                                            Add Practice for
                                            {{
                        months[selectedDate.getMonth()] +
                          " " +
                          selectedDate.getDate() +
                          ", " +
                          (selectedDate.getYear() + 1900)
                      }}
                                        </h3>
                                        <input type="number" name="hr" min="1" max="12" placeholder="H" v-model="practiceHr" />
                                        <input type="number" @change="practiceMChange()" name="min" min="0" max="59" placeholder="M" v-model="practiceM" />
                                        <select v-model="practiceAMPM">
                                            <option value="AM" selected>AM</option>
                                            <option value="PM">PM</option>
                                        </select><br />
                                        <textarea placeholder="Add note..." v-model="practiceNote"></textarea><br />
                                        <button class="theme-button" @click="submitPractice()">
                                            Submit
                                        </button>
                                    </div>
                                </transition>
                                <transition name="slide">
                                    <div class="success" v-if="success">{{ successMessage }}</div>
                                </transition>
                                <transition name="slide">
                                    <div class="error" v-if="error">{{ errorMessage }}</div>
                                </transition>
                                <table class="sidebar-table">
                                    <div class="row table-top">
                                        <div class="col-6 offset-3 my-auto">
                                            {{
                        months[selectedDate.getMonth()] +
                          " " +
                          selectedDate.getDate() +
                          ", " +
                          (selectedDate.getYear() + 1900)
                      }}
                                        </div>
                                        <div v-if="auth" class="col text-right my-auto">
                                            <button @click="showPracticeForm = !showPracticeForm" class="theme-button">
                                                Add Practice
                                            </button>
                                        </div>
                                    </div>
                                    <div class="container list practice" v-for="practice in filteredByDateP" :key="practice.date">
                                        <b>Practice:</b> {{ formatDate(practice.date) }} <br /><b>Note:</b>
                                        {{ practice.note }}
                                    </div>

                                    <div class="container list games" v-for="(post, index) in filteredByDate" :key="index">
                                        <div class="row">
                                            <div class="col-6 my-auto text-center">
                                                <b>VS: </b> {{ post.team2 }}
                                            </div>
                                            <div class="col my-auto text-center">
                                                {{ post.gameSite }}
                                            </div>
                                            <div class="col my-auto text-center">
                                                {{ formatDate(post.date) }}
                                            </div>
                                            <div class="col my-auto text-center">
                                                <span v-if="post.home">
                                                    Home<br /><a v-if="!auth" @click="volunteerPopup(post._id, index)" style="color: #00a7e5;">Volunteer</a></span><span v-else>Away</span>
                                            </div>
                                        </div>
                                        <div v-if="auth && post.volunteers[0]" class="row">
                                            <table>
                                                <th colspan="4" class="light">Volunteers</th>
                                                <tr>
                                                    <td>
                                                        <b>Name</b>
                                                        <hr />
                                                    </td>
                                                    <td>
                                                        <b>Phone</b>
                                                        <hr />
                                                    </td>
                                                    <td>
                                                        <b>Email</b>
                                                        <hr />
                                                    </td>
                                                    <td>
                                                        <b>Position</b>
                                                        <hr />
                                                    </td>
                                                </tr>

                                                <tr v-for="(volunteer, index) in post.volunteers" :key="index">
                                                    <td>{{ volunteer.name }}</td>
                                                    <td>
                                                        <a :href="'tel:' + volunteer.phone">{{
                              volunteer.phone
                            }}</a>
                                                    </td>
                                                    <td>
                                                        <a :href="'mailto:' + volunteer.email">{{
                              volunteer.email
                            }}</a>
                                                    </td>
                                                    <td>{{ volunteer.position }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-schedule" v-else>
            <p>
                The Schedule for {{ this.$route.params.teamName }} has not been created
                yet.
            </p>
        </div>
        <div class="description container-fluid">
            <div class="row">
                <div class="col"></div>
                <div class="col">
                    <transition name="slide">
                        <div class="success" style="margin-bottom:10px;" v-if="memoSuccess">
                            {{ successMessage }}
                        </div>
                    </transition>
                    <transition name="slide">
                        <div v-if="showAddMemo && auth" class="volunteer-form row">
                            <div class="col">
                                <h3>Add Memo</h3>
                                <input type="text" placeholder="Title" v-model="memoTitle" />
                                <br />
                                <textarea placeholder="Add announcement..." v-model="memo"></textarea><br />
                                <button class="theme-button" @click="submitMemo()">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </transition>

                    <div class="row table-top team mx-auto">
                        <div class="col-4 text-center offset-4 my-auto">
                            Announcements
                        </div>
                        <div v-if="auth" class="col my-auto text-right">
                            <button @click="showAddMemo = !showAddMemo" class="theme-button">
                                Make Announcement
                            </button>
                        </div>
                    </div>
                    <div class="row memos">
                        <div class="col">
                            <div>
                                <article class="list" v-for="memo in team.memo
                    .slice()
                    .reverse()
                    .slice(0, 5)" :key="memo.date">
                                    <h3 style="margin-left:0;">{{ memo.title }}</h3>
                                    <span class="meta">{{ formatDate(memo.date) }}</span>
                                    <hr style="width:100%;" />
                                    <p>{{ memo.body }}</p>
                                    <span>{{ memo.author }}</span>
                                </article>
                            </div>
                            <div class="text-center">
                                <button class="theme-button" @click="showMore = !showMore">
                                    <span v-if="showMore">Show Less</span><span v-else>Show More</span>
                                </button>
                            </div>
                            <div v-if="showMore">
                                <article class="list" v-for="memo in team.memo
                    .slice()
                    .reverse()
                    .slice(6, team.memo.length)" :key="memo.date">
                                    <h3 style="margin-left:0;">{{ memo.title }}</h3>
                                    <span class="meta">{{ formatDate(memo.date) }}</span>
                                    <hr style="width:100%;" />
                                    <p>{{ memo.body }}</p>
                                    <span>{{ memo.author }}</span>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TeamService from "@/services/TeamService";
    import UserVal from "@/services/UserVal";
    import PostsService from "@/services/PostsService";
    import FileService from "@/services/FileService";
    export default {
        name: "OrgTemplate",
        data() {
            return {
                heroImageURL: "http://ec2-18-216-99-42.us-east-2.compute.amazonaws.com:8000/images/" +
                    encodeURIComponent(this.$route.params.teamName.trim()) +
                    "/hero.jpg",
                team: {},
                editHero: true,
                posts: [],
                showAddMemo: false,
                filteredByDate: [],
                filteredByDateP: [],
                files: [],
                viewMode: false,
                published: false,
                updatedVolunteers: [],
                volunteers: [],
                showVol: false,
                success: false,
                memoSuccess: false,
                memoTitle: "",
                memo: "",
                user: {},
                showMore: false,
                error: false,
                successMessage: "",
                errorMessage: "",
                showPracticeForm: false,
                gameID: "",
                practiceNote: "",
                practiceHr: "",
                practiceM: "",
                practiceAMPM: "AM",
                index: 0,
                volunteer: {
                    name: "",
                    phone: "",
                    email: "",
                    position: ""
                },
                auth: false,
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
            this.getTeam();
            this.userVal();
            this.getPosts();
        },
        methods: {
            async userVal() {
                const res = await UserVal.userVal();
                if (res.data.accessLevel == "coach" || res.data.accessLevel == "rep") {
                    this.$store.commit("setAuthentication", true);
                    this.auth = true;
                }
                this.user = res.data.username;
            },
            async getTeam() {
                const response = await TeamService.getTeam({
                    teamName: this.$route.params.teamName
                });
                this.team = response.data[0];
                this.published = this.team.published;
                //console.log(this.published)
            },
            upFunc: function(loc) {
                this.files[loc] = this.$refs.file.files[loc];
            },
            submitFile(loc) {
                let formData = new FormData();

                formData.append("team", this.$route.params.teamName);
                if (loc == 0) {
                    formData.append("ref", "heroImage");
                } else if (loc == 1) {
                    formData.append("ref", "descriptionImage");
                }
                formData.append("file", this.files[loc]);
                FileService.fileUpload(formData);
                this.getTeam();
            },
            volunteerPopup: function(id, index) {
                this.gameID = id;
                this.showVol = !this.showVol;
                this.index = index;
            },
            toVol: function(id, i, date) {
                this.viewMode = !this.viewMode;
                let dateTime = new Date(date);
                this.selectedDate = dateTime;
                this.month = dateTime.getMonth();
                this.year = dateTime.getYear() + 1900;
                this.volunteerPopup(id, i);
            },
            async submitVolunteer() {
                var vols = [];
                var volunteers = this.posts[this.index].volunteers;
                for (var i = 0; i < volunteers.length; i++) {
                    vols.push(volunteers[i]);
                }
                vols.push(this.volunteer);

                this.updatedVolunteers = vols;
                var res = await PostsService.updatePost({
                    id: this.gameID,
                    volunteers: this.updatedVolunteers
                });
                console.log(res);
                this.gameID = "";
                this.volunteer = {
                    name: "",
                    phone: "",
                    email: "",
                    position: ""
                };
                this.showVol = false;
                if (res.data.success == false) {
                    this.error = true;
                    var self = this;
                    this.errorMessage = "You have already signed up for this date";
                    setTimeout(function() {
                        self.error = false;
                    }, 3000);
                } else {
                    this.success = true;

                    this.successMessage = "Thank you for signing up to volunteer!";
                    setTimeout(function() {
                        self.success = false;
                    }, 3000);
                }
            },
            async submitPractice() {
                var practice = [];
                var d = new Date(this.selectedDate);
                var m = parseInt(this.practiceM, 10);
                var h;
                if (this.practiceAMPM == "AM") {
                    h = this.practiceHr;
                } else if (this.practiceAMPM == "PM") {
                    h = parseInt(this.practiceHr, 10) + 12;
                }

                d.setHours(h);
                d.setMinutes(m);
                for (var i = 0; i < this.team.practice.length; i++) {
                    practice.push(this.team.practice[i]);
                }
                practice.push({
                    date: d,
                    note: this.practiceNote
                });

                await TeamService.submitPractice({
                    id: this.team._id,
                    practice: practice
                });
                this.showPracticeForm = false;
                this.practiceM = "";
                this.practiceHr = "";
                this.practiceNote = "";
                var self = this;
                this.successMessage = "Practice Saved!";
                this.getTeam();
                this.success = true;
                setTimeout(function() {
                    self.success = false;
                }, 3000);
            },
            async submitMemo() {
                var memos = [];
                for (var i = 0; i < this.team.memo.length; i++) {
                    memos.push(this.team.memo[i]);
                }
                memos.push({
                    date: new Date(),
                    title: this.memoTitle,
                    body: this.memo,
                    author: this.user
                });
                await TeamService.submitMemo({
                    id: this.team._id,
                    memo: memos
                });
                this.showAddMemo = false;
                this.memo = "";
                this.memoTitle = "";
                var self = this;
                this.successMessage = "Announcement Saved!";
                this.getTeam();
                this.memoSuccess = true;
                setTimeout(function() {
                    self.memoSuccess = false;
                }, 3000);
            },
            async getPosts() {
                const response = await PostsService.fetchPostsByName({
                    teamName: this.$route.params.teamName
                });
                this.posts = response.data.posts;
                var games = this.posts;

                for (let i = 0; i < this.posts.length; i++) {
                    if (this.posts[i].team1 != this.$route.params.teamName) {
                        var one = this.posts[i].team2;
                        var two = this.posts[i].team1;
                        games[i].team1 = one;
                        games[i].team2 = two;
                        if (this.posts[i].home == true) {
                            games[i].home = false;
                        } else {
                            games[i].home = true;
                        }
                    }
                }
                console.log(games);
                this.posts = games;
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
                this.showVol = false;
                this.showPracticeForm = false;
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

            practiceMChange: function() {
                let val = this.practiceM;
                if (val < 10) this.practiceM = "0" + val;
            },
            viewModeChange: function() {
                this.viewMode = !this.viewMode;
            }
        },
        computed: {},
        watch: {
            selectedDate: function() {
                var games = [];
                var practive = [];
                for (let i = 0; i < this.posts.length; i++) {
                    if (this.checkDate(this.posts[i].date)) {
                        games.push(this.posts[i]);
                    }
                }
                this.filteredByDate = games;
                for (let i = 0; i < this.team.practice.length; i++) {
                    if (this.checkDate(this.team.practice[i].date)) {
                        practive.push(this.team.practice[i]);
                    }
                }
                this.filteredByDateP = practive;
            }
        }
    };

</script>

<style type="text/css">
    a {
        cursor: pointer;

        text-decoration: underline !important;
    }

    .hero {
        background: silver;
        padding: 100px;
        text-align: center;
        background-size: cover;
        background-position: center;
        color: white;
    }

    .volunteer-form {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 1;
        padding: 10px !important;
        margin: 10px !important;
        border-left: silver solid 1px;
    }

    .team {
        margin: auto;
    }

    article {
        padding: 20px !important;
    }

    article h3 {
        font-size: 20px;
        font-weight: 800;
    }

    article span {
        font-size: 14px;
        font-weight: 600;
    }

    .featured-image img {
        max-height: 300px;
    }

    .featured-image {
        text-align: right;
    }

    .description {
        margin-top: 20px;
        padding-bottom: 20px;
    }

    .team table {
        width: 100%;
        text-align: center;
        color: #000;
        border: none;
        border-spacing: 0;
    }

    .light {
        background: #eee !important;

        border-radius: 5px;
    }

    .no-schedule {
        text-align: center;
        background: #00a7e5;
        padding: 20px;
        font-weight: 800;
    }

    .team table th {
        padding: 15px;
        width: 100%;
        background-color: #00a7e5;
        text-align: center;
    }

    .calendar table {
        border-spacing: 10px;
        border-collapse: separate;
    }

    .days td {
        margin-left: 10px;
        border: none;
        background: #eee;
        height: 60px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 3px;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .dates td {
        margin-left: 10px;
        border: none;
        padding-top: 10px;
        height: 100px !important;
        width: 60px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 3px;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        cursor: pointer;
    }

    .table-top td,
    .table-top {
        background: #00a7e5;
        height: 65px;
        border-radius: 5px !important;
        color: white;
        font-weight: 800;
        margin-left: 0 !important;
        margin-right: 0 !important;
        z-index: 10;
        position: relative;
    }

    .list {
        margin-top: 10px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 5px;
        padding: 10px;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .list:nth-child(even) {
        background: #eee;
    }

    .labels {
        background: #00a7e5;
        font-weight: bold;
    }

    .data-rows tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    .data-rows {
        margin: 10px;
    }

    .data-rows .row {
        margin-top: 5px;
    }

    .form input,
    .form textarea {
        width: 500px;
        padding: 10px;
        border: 1px solid #e0dede;
        outline: none;
        font-size: 12px;
    }

    .sidebar-table {
        z-index: 10;
    }

    .form div {}

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

    .upload {
        position: absolute;
        text-align: left;
        background: white;
        padding: 20px;
        top: 505;
        right: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        z-index: 30;
    }

    .calendar table {
        margin: none;
        text-align: center;
    }

    .sidebar {
        width: 40%;
    }

    .sidebar-table {
        height: 400px;
        background: white;
        position: relative;
        z-index: 10;
    }

    .calendar table table:nth-of-type(1) td {
        text-align: center;
        height: 50px;
        width: 50px;

        border: 1px solid #eee;
    }

    .success {
        background-color: mediumseagreen;
        padding: 20px;
        text-align: center;
        margin-top: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        font-weight: 800;
        color: white;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .error {
        background-color: deeppink;
        padding: 20px;
        text-align: center;
        margin-top: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        font-weight: 800;
        color: white;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .memos {
        background: white;

        position: relative;
    }

    td {
        border: none !important;
    }

    .slide-enter,
    .slide-leave-to {
        visibility: hidden;
        height: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding: 0 !important;
        opacity: 0 !important;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
    }

    .arrows {
        color: white;
        font-weight: bolder;
    }

    .dates .active {
        border: 2px solid #00a7e5 !important;
        background: #fff;
        color: #00a7e5;
        font-weight: bold;
    }

    .active {
        background: #00a7e5;
        color: #fff;
    }

    .blue-row {
        background: #00a7e5;
    }

    .blue-icon {
        color: Black;
    }

    .active .blue-icon {
        color: white !important;
    }

    .bullet {
        height: 8px;
        width: 8px;
        background-color: #00a7e5;
        border-radius: 50%;
        display: inline-block;
        margin: 5px;
    }

    .bullet-blue {
        height: 8px;
        width: 8px;
        background-color: green;
        border-radius: 50%;
        display: inline-block;
        margin: 5px;
    }

    td {
        position: relative;
    }

    hr {
        border: 0;
        height: 1px;
        background: linear-gradient(to right, #ccc, #aaa, #ccc);
        width: 90%;
    }

    .tooltip {
        padding: 10px;
        position: absolute;
        bottom: 60px;
        background: pink;
    }

    .row-heading {
        text-align: center;
        font-weight: 600;
        color: white;
    }

</style>
