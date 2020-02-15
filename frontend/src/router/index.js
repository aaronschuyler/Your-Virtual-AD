import Vue from "vue";
import VueRouter from "vue-router";
import Team from "@/components/Team";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
      {
      path: "/teams/:teamName",
      name: "Team",
      component: Team
    }
  ]
});

export default router;
