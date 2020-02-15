import Api from "@/services/Api";

export default {
  fetchOrgs() {
    return Api().get("orgs");
  },
  addOrg(params) {
    return Api().post("orgs", params);
  },
  updateOrg(params) {
    return Api().put("orgs/" + params.id, params);
  },

  getOrg(params) {
    return Api().get("orgs/" + params.id);
  },
  deleteOrg(id) {
    return Api().delete("orgs/" + id);
  }
};
