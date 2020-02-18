import Api from "@/services/Api";

export default {
  fetchSports() {
    return Api().get("sports");
  },
  addSport(params) {
    return Api().post("sports", params);
  },
  updateSport(params) {
    return Api().put("sports/" + params.sportName, params);
  },

  getSport(params) {
    return Api().get("sports/" + params.sportName);
  },
  deleteSport(id) {
    return Api().delete("sports/" + id);
  }
};
