import Api from "@/services/Api";

export default {
  logout(params) {
    return Api().get("logout", params);
  }
};
