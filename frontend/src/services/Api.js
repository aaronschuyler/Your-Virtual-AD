import axios from "axios";
axios.defaults.withCredentials = true; // enable axios post cookie, default false

export default () => {
  return axios.create({
    baseURL: `http://localhost:8000`
  });
};
