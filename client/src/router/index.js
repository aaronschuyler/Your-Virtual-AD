import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/components/Home";
import Games from "@/components/Games";
import NewGame from "@/components/NewGame";
import EditGame from "@/components/EditGame";
import Schedule from "@/components/Schedule";
import Sports from "@/components/Sports";
import Divisions from "@/components/Divisions";
import Teams from "@/components/Teams";
import Team from "@/components/Team";
import Orgs from "@/components/Orgs";
import Org from "@/components/Org";
import OrgTeams from "@/components/OrgTeams";
import Dates from "@/components/months";
Vue.use(VueRouter);

const router = new VueRouter({
    //mode: "history",
    //base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home
    },
        {
            path: "/games",
            name: "Games",
            component: Games
    },
        {
            path: "/sports",
            name: "Sports",
            component: Sports
    },
        {
            path: "/divisions",
            name: "Divisions",
            component: Divisions
    },
        {
            path: "/games/new",
            name: "NewGame",
            component: NewGame
    },
        {
            path: "/games/:id",
            name: "EditGame",
            component: EditGame
    },
        {
            path: "/teams/:teamName",
            name: "Team",
            component: Team
    },
        {
            path: "/schedule",
            name: "Schedule",
            component: Schedule
    },
        {
            path: "/teams",
            name: "Teams",
            component: Teams
    },
        {
            path: "/organization",
            name: "Orgs",
            component: Orgs
    },
        {
            path: "/dates",
            name: "Dates",
            component: Dates
    },
        {
            path: "/organization/:orgName",
            name: "Org",
            component: Org,
            children: [
                {
                    path: ":sport",
                    name: "OrgTeams",
                    component: OrgTeams
        }
      ]
    }
  ]
});

export default router;
