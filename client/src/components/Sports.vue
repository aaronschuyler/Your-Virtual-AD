<template>
    <div class="table-wrap">
        <h1>Sports</h1>
        <table>
            <tr>
                <td><input placeholder="add a sport..." v-model="sport"></td>
                <td>
                    <button class="theme-button" style="color:black;" @click="addSport">Add Sport</button>
                </td>
            </tr>
            <tr style="background-color:lightblue;">
                <td width="85%"><b>Sport</b></td>
                <td align="center"><b>Action</b></td>
            </tr>
            <tr v-for="sport in sports" v-bind:key="sport._id">
                <td>
                    {{sport.sport}}
                </td>
                <td align="center">
                    <a href="#" @click="deleteSport(sport._id)">Delete</a>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
    import SportsService from "@/services/SportsService";
    import UserVal from "@/services/UserVal";
    export default {
        name: "sports",
        data() {
            return {
                sports: [],
                sport: ""
            };
        },
        mounted() {
            this.getSports();
            this.userVal();
        },
        methods: {
            async userVal() {
                const res = await UserVal.userVal();
                if (res.data.accessLevel == "admin") {
                    this.$store.commit("setAuthentication", true);
                    console.log("you are in");
                } else {
                    console.log("user is not authenticated");
                }
            },
            async getSports() {
                const response = await SportsService.fetchSports();
                this.sports = response.data.sports;
            },
            async deleteSport(id) {
                await SportsService.deleteSport(id);
                this.getSports();
            },
            async addSport() {
                await SportsService.addSport({
                    sport: this.sport
                });
                this.sport = ""
                this.getSports()
            }
        },
        watch: {

        }
    };

</script>

<style type="text/css">
    .table-wrap {
        width: 60%;
        margin: 0 auto;
        text-align: center;
    }

    table {
        width: 100%;
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

    theme-button a {
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
