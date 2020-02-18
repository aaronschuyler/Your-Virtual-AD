<template>
  <div class="table-wrap">
    <h1>Divs</h1>
    <table>
      <tr>
        <td><input placeholder="add a div..." v-model="div" /></td>
        <td>
          <button class="theme-button" style="color:black;" @click="addDiv">
            Add Div
          </button>
        </td>
      </tr>
      <tr style="background-color:lightblue;">
        <td width="85%"><b>Div</b></td>
        <td align="center"><b>Action</b></td>
      </tr>
      <tr v-for="div in divs" v-bind:key="div._id">
        <td>
          {{ div.divName }}
        </td>
        <td align="center">
          <a href="#" @click="deleteDiv(div._id)">Delete</a>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import DivsService from "@/services/DivsService";
import UserVal from "@/services/UserVal";
export default {
  name: "divs",
  data() {
    return {
      divs: [],
      div: ""
    };
  },
  mounted() {
    this.getDivs();
    this.userVal();
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
    async deleteDiv(id) {
      await DivsService.deleteDiv(id);
      this.getDivs();
    },
    async addDiv() {
      await DivsService.addDiv({
        divName: this.div
      });
      this.div = "";
      this.getDivs();
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
