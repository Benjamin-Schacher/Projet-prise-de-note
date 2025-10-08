import axios from "axios";
import { useState } from "react";
import { useInstanceAxios } from "./useInstanceAxios";

export const useEvents = () => {
	// Appelle d'useInstanceAxios qui contient la base de nos requêtes, URL et hook pour le JWT
	const api = useInstanceAxios();

	// Déclaration de variable
	const [events, setEvents] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Handleur de requête générique transmet les erreurs et le loading
	const handleRequest = async (requestFunction, ...args) => {
		setLoading(true);
		setError(null);

		try {
			const response = await requestFunction(...args);
			setEvents(response.data);
			setLoading(false);
			return response;
		} catch (error) {
			setLoading(false);
			throw error;
		}
	};

	// Différente requette qui utilise le handler générique
	const getEvents = () => handleRequest(api.get, "/event/");
	const deleteEvent = (id) => handleRequest(api.delete, `/event/${id}`);
	const getById = (id) => handleRequest(api.get, `/event/${id}`);
	const getByUserId = () => handleRequest(api.get, `/event/mesEvent`);
	const getPaginate = (pageIdx = 1, perPage = 10) => {
		const url = `/event/?_page=${pageIdx}&_per_page=${perPage}`;
		return handleRequest(api.get, url);
	};
	const updateEvent = (event) => handleRequest(api.patch, `/event/${event.id}`, event);
	const createEvent = (event) => handleRequest(api.post, `/event/`, event);
    const getEventsByDate = (startDate) => handleRequest(api.get, `/event/searchAfterDate?startDate=${startDate}`);

	return {
		getEvents,
		getEventsByDate,
		createEvent,
		events,
		error,
		getByUserId,
		loading,
		getById,
		deleteEvent,
		getPaginate,
		updateEvent,
	};
};
