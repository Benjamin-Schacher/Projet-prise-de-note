import axios from "axios";
import { useState } from "react";

export const useAuth = () => {

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Requête qui transmet le temps de loading et les erreurs.
	const handleRequest = async (requestFunction, ...args) => {
		setLoading(true);
		setError(null);

		try {
			const response = await requestFunction(...args);
			setLoading(false);
			return response;
		} catch (error) {
			setLoading(false);
			throw error;
		}
	};

	// Lors de la connexion, on utilise login pour requêter le back avec les données de l'utilisateur. Si bon, ajoute l'id/token en sessionStrorage
	const login = async (credential) => {
		const response = await handleRequest(
			(url, data) => api.post(url, data),
			"/connection",
			credential
		);

		if (response) {
			//sessionStorage.setItem("token", response.token); // Pour utiliser le token
			sessionStorage.setItem("id_user", response.id); // Pour utiliser l'id du connecter
			return true;
		} else {
			throw new Error("Bad credentials");
		}
	};

	return { login, error, loading };
};
