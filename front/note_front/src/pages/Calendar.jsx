import { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useEvents } from "../hook/useEvents";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

// Configuration de la localisation pour react-big-calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { fr },
});

export function Calendar() {
  const navigate = useNavigate();
  const { getByUserId, createEvent, updateEvent, loading, error } = useEvents();
  const { isAuthenticated } = useAuth();
  const [tableEvents, setTableEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [newEvent, setNewEvent] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null); // État pour l'événement sélectionné
  const [editMode, setEditMode] = useState(false); // État pour basculer entre création et modification

  // Charger les événements
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate("/connexion");
          return;
        }
        await fetchUserEvents();
      } catch (err) {
        console.error("Erreur lors du chargement des événements :", err);
      }
    };

    fetchData();
  }, []);

  // Mettre à jour calendarEvents lorsque tableEvents change
  useEffect(() => {
    const mappedEvents = Array.isArray(tableEvents)
      ? tableEvents.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.startDate),
          end: event.endDate ? new Date(event.endDate) : new Date(event.startDate),
        }))
      : [];
    console.log("calendarEvents mis à jour :", mappedEvents);
    setCalendarEvents(mappedEvents);
  }, [tableEvents]);

  // Récupérer les événements de l'utilisateur connecté
  const fetchUserEvents = async () => {
    try {
      console.log("Lancement de fetchUserEvents");
      const resp = await getByUserId();
      const apiEvents = Array.isArray(resp.data.content) ? resp.data.content : [];
      console.log("Événements chargés :", apiEvents);
      setTableEvents(apiEvents);
    } catch (err) {
      console.error("Erreur lors de la récupération des événements :", err);
      setTableEvents([]);
    }
  };

  // Gérer la navigation
  const handleNavigate = (newDate) => {
    console.log("Navigation vers :", newDate);
    setCurrentDate(newDate);
  };

  // Gérer le changement de vue
  const handleViewChange = (view) => {
    console.log("Changement de vue :", view);
    setCurrentView(view);
  };

  // Gérer la sélection d'un événement
  const handleSelectEvent = (event) => {
    console.log("Événement sélectionné :", event);
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      content: tableEvents.find((e) => e.id === event.id)?.content || "",
      startDate: format(new Date(event.start), "yyyy-MM-dd'T'HH:mm"),
      endDate: event.end ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm") : "",
    });
    setEditMode(true); // Passer en mode modification
  };

  // Gérer la soumission du formulaire pour ajouter ou modifier un événement
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: newEvent.title,
        content: newEvent.content,
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: newEvent.endDate ? new Date(newEvent.endDate).toISOString() : null,
        user: {
          id: sessionStorage.getItem("id_user"),
        },
      };

      if (editMode) {
        // Mise à jour de l'événement
        await updateEvent({ ...eventData, id: selectedEvent.id });
      } else {
        // Création d'un nouvel événement
        await createEvent(eventData);
      }

      setNewEvent({ title: "", content: "", startDate: "", endDate: "" });
      setEditMode(false); // Quitter le mode modification
      setSelectedEvent(null); // Réinitialiser l'événement sélectionné
      await fetchUserEvents(); // Recharger les événements
    } catch (err) {
      console.error("Erreur lors de la gestion de l'événement :", err);
    }
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Annuler la modification
  const handleCancelEdit = () => {
    setNewEvent({ title: "", content: "", startDate: "", endDate: "" });
    setEditMode(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="background-event"></div>
      <div className="calendar-container" style={{ height: "80vh", padding: "20px" }}>
        <h2>Mon Calendrier</h2>
        {loading && <p style={{ color: "#fff" }}>Chargement...</p>}
        {error && (
          <p style={{ color: "#fff" }}>
            Erreur : {typeof error === "object" ? JSON.stringify(error) : error}
          </p>
        )}

        {/* Formulaire pour ajouter ou modifier un événement */}
        <form onSubmit={handleSubmitEvent} style={{ marginBottom: "20px" }}>
          <h3>{editMode ? "Modifier l'événement" : "Ajouter un événement"}</h3>
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
          <button type="submit">{editMode ? "Modifier" : "Ajouter"} l'événement</button>
          {editMode && (
            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
              Annuler
            </button>
          )}
        </form>

        {/* Calendrier */}
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          date={currentDate}
          view={currentView}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent} // Ajout du gestionnaire de clic sur événement
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
          }}
        />
      </div>
    </>
  );
}