import { useState } from "react";
import { useInstanceAxios } from "./useInstanceAxios";

export const useNotes = () => {
    const api = useInstanceAxios();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Handler générique pour toutes les requêtes
    const handleRequest = async (requestFunction, ...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await requestFunction(...args);
            setLoading(false);
            return response.data ?? args[0]; // si data est undefined, retourne le premier argument (utile pour patch)
        } catch (err) {
            setLoading(false);
            setError(err);
            throw err;
        }
    };

    // --- Notes
    const getNotes = () => handleRequest(api.get, "/note/");
    const getById = (id) => handleRequest(api.get, `/note/${id}`);
    const getByUserId = (userId) => handleRequest(api.get, `/note/user/${userId}`);
    const getByGrid = (gridId) => handleRequest(api.get, `/note/by-grid/${gridId}`);
    const getPaginate = (pageIdx = 1, perPage = 10) => {
        const url = `/note/?_page=${pageIdx}&_per_page=${perPage}`;
        return handleRequest(api.get, url);
    };
    const createNotes = (note) => handleRequest(api.post, `/note`, note);
    const updateNotes = (note) => handleRequest(api.patch, `/note/${note.id}`, note);
    const deleteNote = (id) => handleRequest(api.delete, `/note/${id}`);

    return {
        notes,
        setNotes,
        loading,
        error,
        getNotes,
        getById,
        getByUserId,
        getByGrid,
        getPaginate,
        createNotes,
        updateNotes,
        deleteNote,
    };
};
