import Api from "@/services/Api";

export default {
    fetchTeams() {
        return Api().get("teams");
    },
    addTeam(params) {
        return Api().post("teams", params);
    },
    updateTeam(params) {
        return Api().put("teams/" + params.id, params);
    },

    getTeam(params) {
        return Api().get("teams/" + params.teamName);
    },
    deleteTeam(id) {
        return Api().delete("teams/" + id);
    },
    fetchTeamsByOrg(params) {
        return Api().get("teams/" + params.orgName + "/" + params.sport);
    },
    fetchTeamsByOrgOnly(params) {
        return Api().get("teamsbyorg/" + params.orgName);
    }
};
