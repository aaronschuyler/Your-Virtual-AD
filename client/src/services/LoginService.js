import Api from "@/services/Api";

export default {
    postLogin(params) {
        return Api()
            .post("users", params)
            .then(function (res) {
                return res.data.passport.user.accessLevel;
            })
            .catch(error => {
                if (error) {
                    return error
                }
            })
    }
};
