import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
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
