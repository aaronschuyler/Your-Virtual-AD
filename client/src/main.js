import Vue from "vue";
import Datetime from "vue-datetime";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VCalendar from "v-calendar";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import moment from "moment";
Vue.use(Datetime);
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTrash);
library.add(faPlus);
library.add(faCalendarAlt);
library.add(faBars);
Vue.component("v-date", VueCtkDateTimePicker);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(VCalendar);
Vue.prototype.moment = moment;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    authenticated: false,
    accessLevel: "public"
  },
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    }
  }
});

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount("#app");
