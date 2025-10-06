import axios from "axios";
import { useState } from "react";
import { useInstanceAxios } from "./useInstanceAxios";

export const useNotes = () => {
	// Appelle d'useInstanceAxios qui contient la base de nos requêtes, URL et hook pour le JWT
	const api = useInstanceAxios();

	// Déclaration de variable
	const [notes, setNotes] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Handleur de requête générique transmet les erreurs et le loading
	const handleRequest = async (requestFunction, ...args) => {
		setLoading(true);
		setError(null);

		try {
			const response = await requestFunction(...args);
			setNotes(response.data);
			setLoading(false);
			return response;
		} catch (error) {
			setLoading(false);
			throw error;
		}
	};

	// Différente requette qui utilise le handler générique
	const getNotes = () => handleRequest(api.get, "/note/");
	const deleteNote = (id) => handleRequest(api.delete, `/note/${id}`);
	const getById = (id) => handleRequest(api.get, `/note/${id}`);
	const getByUserId = (id) => handleRequest(api.get, `/note/mesNotes`);
	const getPaginate = (pageIdx = 1, perPage = 10) => {
		const url = `/note/?_page=${pageIdx}&_per_page=${perPage}`;
		return handleRequest(api.get, url);
	};
	const updateNotes = (notes) => handleRequest(api.patch, `/note/${notes.id}`, notes);
	const createNotes = (notes) => handleRequest(api.post, `/note/`, notes);

	return {
		getNotes,
		createNotes,
		notes,
		error,
		getByUserId,
		loading,
		getById,
		deleteNote,
		getPaginate,
		updateNotes,
	};
};
