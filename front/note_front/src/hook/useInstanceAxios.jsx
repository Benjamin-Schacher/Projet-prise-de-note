import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useInstanceAxios = () => {
  const url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: url,
  });

  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },

    (error) => {
      if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          sessionStorage.removeItem("token");
          navigate();
        }
      }
    }
  );

  return api;
};