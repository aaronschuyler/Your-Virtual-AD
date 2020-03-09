import Api from "@/services/Api";
export default {
  fileUpload(formData) {
    return Api()
      .post("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function(res) {
        console.log("SUCCESS!!");
        console.log(res);
      })
      .catch(function() {
        console.log("FAILURE!!");
      });
  }
};
