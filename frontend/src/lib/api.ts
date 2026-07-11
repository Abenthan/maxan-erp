import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    if (error.response) {
      const msg = error.response.data?.error || error.response.statusText;
      return Promise.reject(new Error(msg));
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("La solicitud tardó demasiado"));
    }
    return Promise.reject(new Error("Error de conexión con el servidor"));
  }
);

export default api;
