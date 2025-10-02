import { useState } from "react";
import { useNotes } from "../hook/useNote";

export function NoteVue({ title, creationDate, content, onClose}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const { getNotes,
            notes,
            error,
            createNotes,
            loading,
            getById,
            getPaginate,
            updateNotes } = useNotes();
  const [errors, setErrors] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { title: "", content: "" };

    if (!newTitle.trim()) {
      newErrors.title = "Le titre ne peut pas être vide";
      valid = false;
    }
    if (!newContent.trim()) {
      newErrors.content = "Le contenu ne peut pas être vide";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      response = updateNotes({ title: newTitle, content: newContent });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Impossible d'envoyer les modifications");
    }
  };

  return (
    <div className="popup-vue-note">
      <div className="note-vue-header">
        <div className="note-vue-header-first-chield">
          <p>{creationDate}</p>
          {!isEditing ? (
            <p className="note-vue-title">{title}</p>
          ) : (
            <input
              className={`note-vue-title editable ${errors.title ? "error-field" : ""}`}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          )}
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        <div>
           <button
              className="btn"
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setErrors({ title: "", content: "" });
                  setNewTitle(title);
                  setNewContent(content);
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? "Annuler" : "Modifier"}
            </button>
        </div>
      </div>

      {!isEditing ? (
        <p className="note-vue-content">{content}</p>
      ) : (
        <>
          <textarea
            className={`note-vue-content editable ${errors.content ? "error-field" : ""}`}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          {errors.content && <p className="error-message">{errors.content}</p>}
        </>
      )}

      {isEditing ? (
        <button className="btn" onClick={handleSubmit}>
          Envoyer
        </button>
      ) : (
        <button className="btn" onClick={onClose}>
          Fermer
        </button>
      )}
    </div>
  );
}
