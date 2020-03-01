<template>
    <div class="org-template">
        <div class="hero" :style="{ backgroundImage: 'url(' + heroImageURL + ')' }">
            <h1>{{ this.$route.params.teamName }}</h1>
            <button class="theme-button" @click="editHero = !editHero">Edit Image</button>
            <div v-if="!editHero" class="upload"><input type="file" id="file" ref="file" @change="upFunc(0)"><button @click="submitFile(0)">submit</button> </div>
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
                    </div>
                    <div class="row" v-for="(post, index) in posts" :key="index">
                        <div class="col">{{ post.team2 }}</div>
                        <div class="col">{{ post.gameSite }}</div>
                        <div class="col">{{ formatDate(post.date) }}</div>
                    </div>

                </div>
            </div>
            <div v-else>
                <div class="calendar">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <table>
                                    <tr class="table-top">
                                        <td colspan="7">
                                            <a class="arrows" href="#!" @click="stepMonth('down')">
                                                &lt; </a>{{ months[month] + " " + year
                        }}<a class="arrows" href="#!" @click="stepMonth('up')">
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
                                            </span>

                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="sidebar col">
                                <table>
                                    <tr class="table-top">
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
                                    <tr class="list" v-for="(post, index) in posts" :key="index">
                                        <td v-if="checkDate(post.date)">
                                            {{ post.team2 }}
                                        </td>
                                        <td v-if="checkDate(post.date)">
                                            {{ post.gameSite }}
                                        </td>
                                        <td v-if="checkDate(post.date)">
                                            {{ formatDate(post.date) }}
                                        </td>
                                        <td v-if="checkDate(post.date)"><a>Volunteer</a></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-schedule" v-else>
            <p>The Schedule for {{ this.$route.params.teamName}} has not been created yet.</p>
        </div>
        <div class="description container-fluid" style="margin-bottom:50px;">
            <div class="row text-center table-top team mx-auto">
                <div class="col-3 offset-4 my-auto">
                    <span class="my-auto">Announcements</span>
                </div>
            </div><br>
            <div class="row">

                <div class="col-3 offset-4">
                    <article>
                        <h3>Practice</h3>
                        <p>Don't forget about practice on Friday!</p>
                        <span>Coach</span>
                    </article>
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
                heroImageURL: "http://ec2-18-216-99-42.us-east-2.compute.amazonaws.com:8000/images/" + encodeURIComponent(this.$route.params.teamName.trim()) + "/hero.jpg",
                team: {},
                editHero: true,
                posts: [],
                files: [],
                viewMode: false,
                published: false,
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
            this.getPosts()
        },
        methods: {
            async userVal() {
                const res = await UserVal.userVal();
                if (res.data.accessLevel == "coach" || res.data.accessLevel == "rep") {
                    this.$store.commit("setAuthentication", true);
                    this.auth = true
                }
            },
            async getTeam() {
                const response = await TeamService.getTeam({
                    teamName: this.$route.params.teamName
                });
                this.team = response.data[0];
                this.published = this.team.published
                //console.log(this.published)
            },
            upFunc: function(loc) {
                this.files[loc] = this.$refs.file.files[loc]

            },
            submitFile(loc) {
                let formData = new FormData();

                formData.append('team', this.$route.params.teamName)
                if (loc == 0) {
                    formData.append('ref', 'heroImage')
                } else if (loc == 1) {
                    formData.append('ref', 'descriptionImage')
                }
                formData.append('file', this.files[loc])
                FileService.fileUpload(formData)
            },
            async getPosts() {
                const response = await PostsService.fetchPostsByName({
                    teamName: this.$route.params.teamName
                });
                this.posts = response.data.posts
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
            viewModeChange: function() {
                this.viewMode = !this.viewMode
            }
        },
        computed: {},
    };

</script>

<style type="text/css">
    a {
        cursor: pointer;
    }

    .hero {

        background: silver;
        padding: 100px;
        text-align: center;
        background-size: cover;
        background-position: center;
        color: white;
    }

    .team {
        width: 90%;
        margin: auto;
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
    }

    .team table {
        width: 100%;
        text-align: center;
        color: #000;
        border: none;
        border-spacing: 0;
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
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    }

    .dates td {
        margin-left: 10px;
        border: none;
        padding-top: 10px;
        height: 100px !important;
        width: 60px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-radius: 3px;
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        cursor: pointer;
    }

    .table-top td,
    .table-top {
        background: #00a7e5;
        height: 50px;
        border-radius: 5px !important;
        color: white;
        font-weight: 800;
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

    .form input,
    .form textarea {
        width: 500px;
        padding: 10px;
        border: 1px solid #e0dede;
        outline: none;
        font-size: 12px;
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
        z-index: 30
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

        border: 1px solid #eee;
    }

    .arrows {
        color: white;
        font-weight: bolder;
    }

    .active {
        background-color: #00a7e5;
        color: white;
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
        background-color: orangered;
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
    }

</style>
