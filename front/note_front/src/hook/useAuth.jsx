import axios from "axios";
import { useState } from "react";
import {jwtDecode} from "jwt-decode";

export const useAuth = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Stocker et gérer le token
	const setToken = (token) => {
		sessionStorage.setItem("token", token);
	};

	const getToken = () => sessionStorage.getItem("token");

    // Retourne true si un token est présent
	const isAuthenticated = () => !!getToken();

	// Connexion

    const login = async (credential) => {
        const response = await axios.post("http://localhost:8080/auth/connexion", credential);
        const { token } = response.data;

        if (!token) throw new Error("Pas de token reçu");

        setToken(token);

        // 🧩 Décodage du token
        const decoded = jwtDecode(token);
        console.log("Token décodé:", decoded);

        // si l'id est présent dans le token
        if (decoded.id) {
            sessionStorage.setItem("id_user", decoded.id);
        }

    };

	// Déconnexion
	const logout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("id_user");
	};

	return {
		login,
		logout,
		error,
		loading,
		isAuthenticated,
		setToken,
		getToken,
	};
};
