import axios from "axios";
axios.defaults.withCredentials = true; // enable axios post cookie, default false

export default () => {
    return axios.create({
        baseURL: `http://ec2-18-216-99-42.us-east-2.compute.amazonaws.com:8000`
    });
};
