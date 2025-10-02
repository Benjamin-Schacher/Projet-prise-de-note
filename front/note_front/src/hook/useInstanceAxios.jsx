import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useInstanceAxios = () => {
	// URL défini dans le .env
	const url = import.meta.env.VITE_API_URL;

	const navigate = useNavigate();

	// Base de la requete avec l'url
	const api = axios.create({
		baseURL: url,
	});

	// Intercepteur pour ajouter le token jwt si il existe sinon rien ne se passe
	api.interceptors.request.use((config) => {
		const token = sessionStorage.getItem("token");

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	});

	// Intercepteur de réponse pour gérer les 401 et 403 et rediriger vers la page de connecxion
	api.interceptors.response.use(
		(response) => {
			return response;
		},

		(error) => {
			if (error.response) {
				const status = error.response.status;

				if (status === 401 || status === 403) {
					sessionStorage.removeItem("token");
					navigate("/connexion");
				}
			}
		}
	);

	return api;
};
