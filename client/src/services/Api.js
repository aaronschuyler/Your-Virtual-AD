import axios from "axios";
axios.defaults.withCredentials = true; // enable axios post cookie, default false

export default () => {
    return axios.create({
        baseURL: `http://18.218.24.115:8000`
    });
};
