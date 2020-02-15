import Api from "@/services/Api";

export default {
    fetchDivs() {
        return Api().get("divs");
    },
    addDiv(params) {
        return Api().post("divs", params);
    },
    updateDiv(params) {
        return Api().put("divs/" + params.divName, params);
    },

    getDiv(params) {
        return Api().get("divs/" + params.divName);
    },
    deleteDiv(id) {
        return Api().delete("divs/" + id);
    }
};
