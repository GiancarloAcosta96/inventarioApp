import axios from "axios";
const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  Authorization: token ? `Bearer ${token}` : "",
};

const urlGeneral = "http://localhost:5134/api/";
const urlProd =
  "https://inventarioapp-backend-hzahh2g8axd5c9b0.canadacentral-01.azurewebsites.net/api/";

const axiosPedido = axios.create({
  baseURL: urlProd,
  headers: headers,
});

const axiosProducto = axios.create({
  baseURL: urlProd,
  headers: headers,
});

const axiosCliente = axios.create({
  baseURL: urlProd,
  headers: headers,
});

const axiosUsuario = axios.create({
  baseURL: urlProd,
  headers: headers,
});

const axiosRol = axios.create({
  baseURL: urlProd,
  headers: headers,
});

axiosPedido.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Si hay error 401
axiosPedido.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { axiosPedido, axiosProducto, axiosCliente, axiosUsuario, axiosRol };
