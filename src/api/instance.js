import axios from "axios";

const createApi = ({ path }) => {
  if (`${window.location.hostname}:5000` === path) {
    const apiInstance = axios.create({
      baseURL: `http://${path}/api`,
    });
    return apiInstance;
  } else {
    const apiInstance = axios.create({
      baseURL: `http://${path}/api`,
    });
    return apiInstance;
  }
};
export default createApi;
