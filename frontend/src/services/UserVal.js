import Api from "@/services/Api";

export default {
  userVal(params) {
    return Api()
      .get("val", params)
      .then(function(res) {
        return res;
      });
  }
};
