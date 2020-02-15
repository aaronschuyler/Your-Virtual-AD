import Api from "@/services/Api";

export default {
  fetchDivs() {
    return Api().get("divs");
  },
  addDiv(params) {
    return Api().post("divs", params);
  },
  updateDiv(params) {
    return Api().put("divs/" + params.id, params);
  },

  getDiv(params) {
    return Api().get("divs/" + params.id);
  },
  deleteDiv(id) {
    return Api().delete("divs/" + id);
  }
};
