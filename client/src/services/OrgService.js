import Api from "@/services/Api";

export default {
    fetchOrgs() {
        return Api().get("orgs");
    },
    addOrg(params) {
        return Api().post("orgs", params);
    },
    updateOrg(params) {
        return Api().put("orgs/" + params.orgName, params);
    },

    getOrg(params) {
        return Api().get("orgs/" + params.orgName);
    },
    deleteOrg(id) {
        return Api().delete("orgs/" + id);
    }
};
