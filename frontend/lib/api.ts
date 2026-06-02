import axios from "axios";

const api = axios.create({
  baseURL: "https://brahmo-hq3h.onrender.com/api",
});

export default api;