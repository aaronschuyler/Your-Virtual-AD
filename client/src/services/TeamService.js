import Api from "@/services/Api";

export default {
  fetchTeams() {
    return Api().get("teams");
  },
  addTeam(params) {
    return Api().post("teams", params);
  },
  updateTeam(params) {
    return Api().put("teams/" + params.teamName, params);
  },

  getTeam(params) {
    return Api().get("teams/" + params.id);
  },
  deleteTeam(id) {
    return Api().delete("teams/" + id);
  },
  fetchTeamsByOrg(params) {
    return Api().get("teams/" + params.orgName + "/" + params.sport);
  }
};
