<template>
  <div v-if="this.$store.state.authenticated" class="org-template">
    <nav class="sports-nav">
      <router-link
        v-bind:to="{
          name: 'Org',
          params: { orgName: this.$route.params.orgName }
        }"
        ><b>{{ this.$route.params.orgName }}</b></router-link
      >
      |
      <select @change="selectSport(this)" v-model="selectedSport">
        <option value="" selected>Select a Sport</option>
        <option
          v-for="sport in sports"
          :key="sport.sport"
          :value="sport.sport"
          >{{ sport.sport }}</option
        >
      </select>
    </nav>
    <router-view :key="$route.fullPath"></router-view>
    <div v-if="main()">
      <br />
      <button @click="editFunc" class="theme-button">{{ buttonText }}</button>
      <div>
        <br />Organization:
        <input
          type="text"
          v-model="SchoolName"
          :readonly="!edit"
          v-bind:class="{ readonly: !edit }"
        />
        <br /><br />
        Address:
        <input
          type="text"
          v-model="streetAddress"
          :readonly="!edit"
          v-bind:class="{ readonly: !edit }"
        />
        Address Line 2:
        <input
          type="text"
          v-model="addressLine2"
          :readonly="!edit"
          v-bind:class="{ readonly: !edit }"
        /><br /><br />
        City:
        <input
          type="text"
          v-model="city"
          :readonly="!edit"
          v-bind:class="{ readonly: !edit }"
        />
        State:
        <input
          type="text"
          v-model="state"
          :readonly="!edit"
          v-bind:class="{ readonly: !edit }"
        />
        Zip:
        <input
          type="text"
          v-model="zip"
          :readonly="!edit"
          v-bind:class="{ readonly: !edit }"
        /><br /><br />
        <hr width="60%" />
        <br /><br />
        <b>School Contacts:</b><br /><br />
        <span v-for="(contact, index) in contacts" v-bind:key="index">
          <input
            type="text"
            v-model="contacts[index].name"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          />
          <input
            type="text"
            v-model="contacts[index].email"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          />
          <input
            type="text"
            v-model="contacts[index].phone"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          /><br /><br /> </span
        ><br /><br />
        <hr width="60%" />
        <br /><br /><b
          >Game Locations:
          <button class="theme-button" @click="addGymLoc()">
            Add Location
          </button></b
        ><br /><br />
        <span
          v-for="(gymLocation, index) in gymLocations"
          v-bind:key="gymLocation.gymName"
        >
          <input
            type="text"
            v-model="gymLocations[index].gymName"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          />
          Address:
          <input
            type="text"
            v-model="gymLocations[index].streetAddress"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          />
          Address Line 2:
          <input
            type="text"
            v-model="gymLocations[index].addressLine2"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          /><br /><br />
          City:
          <input
            type="text"
            v-model="gymLocations[index].city"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          />
          State:
          <input
            type="text"
            v-model="gymLocations[index].state"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          />
          Zip:
          <input
            type="text"
            v-model="gymLocations[index].zip"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          /><br /><br />
          Sport:
          <input
            type="text"
            v-model="gymLocations[index].sport"
            :readonly="!edit"
            v-bind:class="{ readonly: !edit }"
          /><br /><br /><br /><br />
          <hr width="30%" />
          <br /><br />
        </span>
      </div>
      <div v-if="addGymLocData.bool" class="popup-window">
        <button @click="addGymLoc()" class="theme-button x"><b>X</b></button>
        <input
          placeholder="Location Name"
          v-model="addGymLocData.gymName"
        /><br /><br />
        <input
          placeholder="Street Address"
          v-model="addGymLocData.streetAddress"
        /><br /><br />
        <input
          placeholder="Street Address Line 2"
          v-model="addGymLocData.addressLine2"
        /><br /><br />
        <input placeholder="City" v-model="addGymLocData.city" /><br /><br />
        <input placeholder="State" v-model="addGymLocData.state" /><br /><br />
        <input placeholder="Zip" v-model="addGymLocData.zip" /><br /><br />
        <select v-model="addGymLocData.sport"
          ><br /><br />
          <option selected value="">Select A Sport</option>
          <option
            v-for="sport in sports"
            :key="sport.sport"
            :value="sport.sport"
            >{{ sport.sport }}</option
          >
        </select>
        <button class="theme-button" @click="addGymLocSubmit()">
          Add Game Location
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import OrgService from "@/services/OrgService";
import SportsService from "@/services/SportsService";
import UserVal from "@/services/UserVal";
export default {
  name: "org",

  data() {
    return {
      sports: [],
      selectedSport: "",
      buttonText: "Edit",
      edit: false,
      SchoolName: this.$route.params.orgName,
      description: "",
      addGymLocData: {
        gymName: "",
        streetAddress: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        sport: "",
        bool: false
      },

      streetAddress: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",

      contacts: [
        {
          name: "",
          email: "",
          phone: ""
        }
      ],
      gymLocations: []
    };
  },
  mounted() {
    this.getOrg();
    this.getSports();
    this.reset();
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
    editFunc: function() {
      this.edit = !this.edit;
      if (this.edit == false) {
        this.buttonText = "Edit";
        this.updateOrg();
      } else {
        this.buttonText = "Save Changes";
      }
    },
    async updateOrg() {
      await OrgService.updateOrg({
        orgName: this.SchoolName,
        streetAddress: this.streetAddress,
        addressLine2: this.addressLine2,
        city: this.city,
        state: this.state,
        zip: this.zip,

        contacts: this.contacts,
        gymLocations: this.gymLocations
      });
      this.getOrg();
    },
    async getSports() {
      const response = await SportsService.fetchSports();
      this.sports = response.data.sports;
    },
    addGymLoc: function() {
      this.addGymLocData.bool = !this.addGymLocData.bool;
    },
    async addGymLocSubmit() {
      var gymLoc = this.gymLocations;
      gymLoc.push(this.addGymLocData);

      await OrgService.updateOrg({
        orgName: this.SchoolName,
        streetAddress: this.streetAddress,
        addressLine2: this.addressLine2,
        city: this.city,
        state: this.state,
        zip: this.zip,
        contacts: this.contacts,
        gymLocations: gymLoc
      });
      this.getOrg();
    },
    selectSport: function() {
      if (this.$route.params.sport) {
        this.$router.push({
          path: this.selectedSport
        });
      } else {
        this.$router.push({
          path: this.$route.params.orgName + "/" + this.selectedSport
        });
      }
    },
    reset: function() {
      this.selectedSport = "";
    },
    async getOrg() {
      const response = await OrgService.getOrg({
        orgName: this.$route.params.orgName
      });

      if (response.data[0].streetAddress) {
        this.streetAddress = response.data[0].streetAddress;
      }
      if (response.data[0].addressLine2) {
        this.addressLine2 = response.data[0].addressLine2;
      }
      if (response.data[0].city) {
        this.city = response.data[0].city;
      }
      if (response.data[0].state) {
        this.state = response.data[0].state;
      }
      if (response.data[0].zip) {
        this.zip = response.data[0].zip;
      }
      if (response.data[0].contacts.length > 0) {
        this.contacts = response.data[0].contacts;
      }
      if (response.data[0].gymLocations.length > 0) {
        this.gymLocations = response.data[0].gymLocations;
      }
    },
    main: function() {
      var route = "/organization/" + encodeURI(this.$route.params.orgName);

      return this.$route.path === route;
    }
  }
};
</script>

<style type="text/css">
.sports-nav {
  background: dodgerblue;
  padding: 20px;
  width: 60%;
  text-align: center;
  margin: auto;
}

.popup-window {
  position: absolute;
  top: 20%;
  width: 40%;
  left: 30%;
  right: 30%;
  background: royalblue;
  padding-top: 50px;
  padding-bottom: 50px;
}

.x {
  position: absolute;
  top: 0px;
  right: 0px;
}

.readonly {
  border: 0px;
  border-bottom: solid 2px #000;
  border-radius: 0px;
}

.sports-nav a {
  color: white;
  padding: 20px;
  margin: 0px 10px;
}

.sports-nav a.router-link-exact-active {
  padding: 20px;
  background-color: orangered;
}
</style>
