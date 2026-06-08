import axios from "axios";

const api = axios.create({
  baseURL: "https://fittech-m177.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fittech_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("fittech_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;