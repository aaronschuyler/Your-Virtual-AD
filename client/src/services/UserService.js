import Api from "@/services/Api";

export default {
    fetchUsers() {
        return Api().get("users");
    },
    addUser(params) {
        return Api().post("signup", params);
    },
    updateUser(params) {
        return Api().put("users/" + params.userName, params);
    },

    getUser(params) {
        return Api().get("users/" + params.userName);
    },
    deleteUser(id) {
        return Api().delete("users/" + id);
    }
};
