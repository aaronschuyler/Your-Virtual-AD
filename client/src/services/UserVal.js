import Api from "@/services/Api";

export default {
  userVal(params) {
    return Api()
      .get("users", params)
      .then(function(res) {
        return res;
      });
  }
};
