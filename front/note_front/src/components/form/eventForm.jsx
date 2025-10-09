export function EventForm({ newEvent, setNewEvent, editMode, setEditMode, selectedEvent, handleSubmitEvent, handleInputChange, handleCancelEdit }) {
  return (
    <div className="form-container">
      <h3>{editMode ? "Modifier l'événement" : "Ajouter un événement"}</h3>
      <form onSubmit={handleSubmitEvent}>
        <div>
          <label>Titre :</label>
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Contenu :</label>
          <textarea
            name="content"
            value={newEvent.content}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date de début :</label>
          <input
            type="datetime-local"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date de fin (optionnel) :</label>
          <input
            type="datetime-local"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">
          {editMode ? "Modifier" : "Ajouter"} l'événement
        </button>
        {editMode && (
          <button
            type="button"
            onClick={handleCancelEdit}
          >
            Annuler
          </button>
        )}
      </form>
    </div>
  );
}