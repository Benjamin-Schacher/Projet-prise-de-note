import axios from "axios";
import { useState } from "react";
import { useInstanceAxios } from "./useInstanceAxios";

export const useNotes = () => {
  const api = useInstanceAxios();

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

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

  const getNotes = () => handleRequest(api.get, "/note/");
  const getById = (id) => handleRequest(api.get, `/note/${id}`);
  const getByUserId = (id) => handleRequest(api.get, `/note/user/${id}`);
  const getPaginate = (pageIdx = 1, perPage = 10) => {
    const url = `/note/?_page=${pageIdx}&_per_page=${perPage}`;
    return handleRequest(api.get, url);
  };
  const updateNotes = (notes) =>
    handleRequest(api.patch, `/note/${notes.id}`, notes);
  const createNotes = (notes) => handleRequest(api.post, `/note/`, notes);

  return {
    getNotes,
    createNotes,
    notes,
    error,
    getByUserId,
    loading,
    getById,
    getPaginate,
    updateNotes,
  };
};