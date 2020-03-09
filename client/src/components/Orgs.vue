<template>
  <div v-if="this.$store.state.authenticated" class="posts">
    <h1>Orgs</h1>
    <div class="search">
      Search: <input type="text" v-model="search" @keyup="searchFunc(search)" />
    </div>
    <div v-if="orgs.length > 0" class="table-wrap">
      <table>
        <tr>
          <td colspan="2">
            <input placeholder="add an Organization..." v-model="org" />
          </td>
          <td>
            <button class="theme-button" style="color:black;" @click="addOrg">
              Add Org
            </button>
          </td>
        </tr>
        <tr>
          <td width="60%">Org</td>
          <td width="25%">City</td>
          <td align="center">Action</td>
        </tr>
        <tr v-for="org in orgs" v-bind:key="org.orgName">
          <td>
            <router-link
              :to="{ name: 'Org', params: { orgName: org.orgName } }"
              >{{ org.orgName }}</router-link
            >
          </td>
          <td>{{ org.city }}</td>
          <td align="center">
            <router-link
              v-bind:to="{ name: 'Org', params: { orgName: org.orgName } }"
              >Edit</router-link
            >
            |
            <a href="#" @click="deleteOrg(org._id)">Delete</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>There is nothing to see here.</div>
  </div>
</template>

<script>
import OrgService from "@/services/OrgService";
import UserVal from "@/services/UserVal";
export default {
  name: "orgs",
  data() {
    return {
      rawOrgs: [],
      orgs: [],
      newOrg: false,
      orgName: "",
      search: "",
      org: ""
    };
  },
  mounted() {
    this.getOrgs();
    this.userVal();
  },
  methods: {
    async userVal() {
      const res = await UserVal.userVal();
      if (res.data.accessLevel == "admin") {
        this.$store.commit("setAuthentication", true);
      } else {
        this.$router.push("/");
      }
    },
    async getOrgs() {
      const response = await OrgService.fetchOrgs();
      this.orgs = response.data.orgs;
      this.rawOrgs = response.data.orgs;
    },
    async deleteOrg(id) {
      await OrgService.deleteOrg(id);
      this.getOrgs();
    },
    async addOrg() {
      await OrgService.addOrg({
        orgName: this.org
      });
      this.$router.push({
        name: "Orgs"
      });
      this.newOrg = !this.newOrg;
      this.getOrgs();
    },
    searchFunc: function(val) {
      var sort = this.rawOrgs;

      var sorted = [];
      var count = 0;
      for (var i = 0; i < sort.length; i++) {
        if (!(typeof val === "string" || val instanceof String)) {
          this.orgs = this.rawOrgs;
          break;
        } else if (
          sort[i].orgName.toLowerCase().includes(val.toLowerCase()) ||
          sort[i].city.toLowerCase().includes(val.toLowerCase())
        ) {
          sorted[count] = sort[i];
          count++;
        }
      }

      this.orgs = sorted;
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
