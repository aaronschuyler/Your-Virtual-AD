import Vue from "vue";
import Datetime from "vue-datetime";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import VueCookies from 'vue-cookies'
import {
    BootstrapVue,
    IconsPlugin
} from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueCookies)
Vue.use(Datetime);
import {
    library
} from "@fortawesome/fontawesome-svg-core";
import {
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import {
    faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import {
    faBars
} from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon
} from "@fortawesome/vue-fontawesome";

library.add(faTrash);
library.add(faPlus);
library.add(faCalendarAlt);
library.add(faBars);
Vue.component("v-date", VueCtkDateTimePicker);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        authenticated: false,
        accessLevel: "public"
    },
    mutations: {
        setAuthentication(state, status) {
            state.authenticated = status;
        },
        setOrg(state, status) {
            state.org = status
        }
    }
});

new Vue({
    router,
    store: store,
    render: h => h(App)
}).$mount("#app");
