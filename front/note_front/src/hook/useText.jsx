import { useInstanceAxios } from "./useInstanceAxios";
import { useState, useEffect, useRef } from "react";
import { debounce } from 'lodash';

export const useText = () => {
  const api = useInstanceAxios();
  const [texts, setTexts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Création d’une note
  const user_id = sessionStorage.getItem("id_user");

  function extractTitleFromContent(content) {
    setError(null);
    try {
      const json = typeof content === "string" ? JSON.parse(content) : content;
      const root = json.root;
      if (!root || !Array.isArray(root.children)) return null;

      // Cherche le premier <h1>
      for (const node of root.children) {
        if (node.type === "heading" && node.tag === "h1" && node.children) {
          return node.children.map(child => child.text).join('') || null;
        }
      }

      // Sinon, prends le premier mot du premier texte trouvé
      for (const node of root.children) {
        if (node.children) {
          for (const child of node.children) {
            if (child.text && typeof child.text === "string") {
              return child.text.split(" ")[0]; // premier mot
            }
          }
        }
      }
    } catch (e) {
      //console.error("Erreur parsing JSON", e);
      setError("Une erreur est survenue...");
    }

    return "Sans titre";
  }


  // Gestion des requêtes génériques
  const handleRequest = async (requestFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestFunction(...args);
      const data = response.data?.content || response.data;
      //const data = response.data;

      if (!data) throw new Error("Réponse vide ou invalide");

      // Toujours stocker 'texts' comme tableau
      setTexts(Array.isArray(data) ? data : [data]);

      return data; // On retourne les données
    } catch (error) {
      //console.error("Error loading notes:", error);
      setError("Une erreur est survenue.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAllData = async (requestFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestFunction(...args);
      const data = response.data;  

      if (!data) throw new Error("Réponse vide ou invalide");

      return data; 
    } catch (error) {
      console.error("Error:", error);
      setError("Une erreur est survenue.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Récupération des notes
  const fetchTexts = () =>
    handleRequest(api.get, `text/user/${user_id}`);

  const addText = async ( content) => {

    const generatedTitle = extractTitleFromContent(content);
    const newText = await handleRequestAllData(api.post, `/text`, {
      title : generatedTitle, 
      content : content,
      user: { id: parseInt(user_id) }
    });

    if (newText) {
      setTexts(prev => [...prev, newText]);
    }
    return newText;
  };

  // Patch avec debounce
 const debouncedUpdate = useRef(
  debounce(async (id, updatedFields) => {
    setError(null);
    try {
      // Génère le title depuis le contenu
      const title = extractTitleFromContent(updatedFields.content);
      //console.log("PATCH envoyé :", id, title, updatedFields);

      // On combine content et title dans le même objet pour le patch
      const response = await api.patch(`/text/${id}`, { ...updatedFields, title });
      const updatedText = response.data;

      //console.log("Réponse PATCH :", updatedText);

      // Mise à jour locale
      setTexts(prev =>
        prev.map(t => (t.id === updatedText.id ? updatedText : t))
      );

    } catch (err) {
      //console.error("Erreur lors de la mise à jour :", err);
      setError("Une erreur est survenue...");
    }
  }, 1000)
).current;

// Fonction pour appeler la mise à jour
const updateText = (id, updatedFields) => {
  debouncedUpdate(id, updatedFields);
};

  // Suppression
  const deleteText = (id) => api.delete(`/text/${id}`);

  useEffect(() => {
    fetchTexts();
  }, []);

  return {
    texts,
    setTexts,
    error,
    setError,
    loading,
    fetchTexts,
    addText,
    deleteText,
    updateText, 
    extractTitleFromContent
  };
};
