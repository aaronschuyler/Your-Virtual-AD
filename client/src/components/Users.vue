<template>
    <div class="table-wrap">
        <h1>Users</h1>
        <table>
            <tr>
                <td>
                    <input placeholder="Username" v-model="username" />
                    <input placeholder="Password" v-model="password" />
                    <select v-model="accessLevel">
                        <option disabled selected="true" value="">Select Access Level</option>
                        <option value="rep">School Rep</option>
                        <option value="coach">Coach</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select v-model="org">
                        <option value="" disabled selected>Select a School</option>
                        <option v-for="(school, index) in orgs" :value="school.orgName" v-bind:key="index">{{school.orgName}}</option>
                    </select>
                </td>
                <td>
                    <button class="theme-button" style="color:black;" @click="addUser">
                        Add User
                    </button>
                </td>
            </tr>
            <tr style="background-color:lightblue;">
                <td width="85%"><b>User</b></td>
                <td align="center"><b>Action</b></td>
            </tr>
            <tr v-for="user in users" v-bind:key="user._id">
                <td>
                    {{ user.username }}
                </td>
                <td align="center">
                    <a href="#" @click="deleteUser(user._id)">Delete</a>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
    import UsersService from "@/services/UserService";
    import OrgService from "@/services/OrgService";
    import UserVal from "@/services/UserVal";
    export default {
        name: "users",
        data() {
            return {
                users: [],
                orgs: [],
                org: "",
                username: "",
                password: "",
                accessLevel: "",
            };
        },
        mounted() {
            this.getUsers();
            this.userVal();
            this.getOrgs()
        },
        methods: {
            async userVal() {
                const res = await UserVal.userVal();
                if (res.data.accessLevel == "admin") {
                    this.$store.commit("setAuthentication", true);
                }
            },
            async getUsers() {
                const response = await UsersService.fetchUsers();
                this.users = response.data.users;
            },
            async getOrgs() {
                const response = await OrgService.fetchOrgs();
                this.orgs = response.data.orgs;
            },
            async deleteUser(id) {
                await UsersService.deleteUser(id);
                this.getUsers();
            },
            async addUser() {
                await UsersService.addUser({
                    username: this.username,
                    password: this.password,
                    accessLevel: this.accessLevel,
                    organization: this.org
                });
                this.user = "";
                this.getUsers();
            }
        },
        watch: {}
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
