import { useEffect, useState, useRef } from "react";
import { useNotes } from "./useNote";
import { clampToGrid, randomPosInGrid } from "../utils/gridBounds";

export function useNotes2({ gridSize, selectedGrid, navigate }) {
    const { getByUserId, createNotes, updateNotes , deleteNote} = useNotes();

    const [tableNotes, setTableNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const loadedRef = useRef(false);

    // --- Chargement initial des notes de l'utilisateur
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const fetchUserNotes = async () => {
            const userId = sessionStorage.getItem("id_user");
            if (!userId) {
                navigate("/connexion");
                return;
            }

            try {
                const res = await getByUserId(userId);
                const apiNotes = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];

                // 1️⃣ On stocke les positions brutes du back
                const mapped = apiNotes.map((note) => ({
                    id: note.id.toString(),
                    title: note.title,
                    content: note.content,
                    contentPreview: (note.content || "").substring(0, 50),
                    creationDate: new Date(note.date).toISOString().split("T")[0],
                    gridId: note.grid_id ?? null,
                    position: {
                        x: note.pos_x ?? 0,
                        y: note.pos_y ?? 0
                    }
                }));

                console.log("🧭 Notes reçues :", mapped);
                setTableNotes(mapped);
            } catch (err) {
                console.error("❌ Erreur lors de la récupération des notes :", err);
            }
        };

            fetchUserNotes().catch(err => console.error(err));
        }, [getByUserId, navigate]);


    // --- Recalcul position notes si la grille change
    useEffect(() => {
        setTableNotes((prev) =>
            prev.map((n) => ({ ...n, position: clampToGrid(n.position, n.size, gridSize) }))
        );
    }, [gridSize]);

    // --- Recalcul position notes sur resize
    useEffect(() => {
        const onResize = () => {
            setTableNotes((prev) =>
                prev.map((n) => ({ ...n, position: clampToGrid(n.position, n.size, gridSize) }))
            );
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [gridSize]);

    // --- Création d'une note
    const handleCreateNote = async ({ title, content }) => {
        const userId = sessionStorage.getItem("id_user");
        if (!userId) return navigate("/connexion");

        const randPos = randomPosInGrid(undefined, gridSize);
        const newNoteData = {
            title,
            content,
            date: new Date().toISOString(),
            user: { id: userId },
            grid: selectedGrid?.id ? { id: selectedGrid.id } : null,
            pos_x: randPos.x,
            pos_y: randPos.y,
            is_grid: Boolean(selectedGrid?.id),
        };

        try {
            const createdNote = await createNotes(newNoteData);
            const noteForFront = {
                id: createdNote.id.toString(),
                title: createdNote.title,
                content: createdNote.content,
                contentPreview: (createdNote.content || "").substring(0, 50),
                creationDate: new Date(createdNote.date).toISOString().split("T")[0],
                gridId: createdNote.grid_id ?? (selectedGrid?.id || null),
                position: clampToGrid({ x: createdNote.pos_x ?? randPos.x, y: createdNote.pos_y ?? randPos.y }, undefined, gridSize)
            };
            setTableNotes((prev) => [...prev, noteForFront]);
            setSelectedNote(noteForFront);
        } catch (err) {
            console.error("❌ Erreur lors de la création de la note :", err);
        }
    };

    // --- Mise à jour d'une note existante
    const handleUpdateNote = async (note) => {
        try {
            const updated = await updateNotes(note); // appel à l'API
            // retourne l'objet mis à jour pour le parent
            return { ...note, ...updated.data };
        } catch (err) {
            console.error("Erreur lors de la mise à jour de la note :", err);
            throw err;
        }
    };
    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
            setTableNotes(prev => prev.filter(n => n.id !== id));
            if (selectedNote?.id === id) setSelectedNote(null);
        } catch (err) {
            console.error("Erreur lors de la suppression de la note :", err);
        }
    };
    // --- Drag & Resize
    const updateNoteSize = (id, size) => {
        setTableNotes((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, size, position: clampToGrid(n.position, size, gridSize) } : n
            )
        );
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;
        const id = active.id;
        const note = tableNotes.find((n) => n.id === id);
        if (!note) return;

        const newPos = clampToGrid({ x: note.position.x + delta.x, y: note.position.y + delta.y }, note.size, gridSize);

        setTableNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, position: newPos } : n))
        );

        handleUpdateNote({ ...note, pos_x: newPos.x, pos_y: newPos.y })
            .then(updated => {
                setTableNotes(prev =>
                    prev.map(n =>
                        n.id === updated.id
                            ? { ...n, position: { x: updated.pos_x, y: updated.pos_y } } // <-- ici aussi
                            : n
                    )
                );
            })
            .catch(() => {});
    };


    const openNoteById = (id) => {
        const note = tableNotes.find((n) => n.id === id);
        if (note) setSelectedNote(note);
    };

    const closeNoteModal = () => setSelectedNote(null);

    return {
        tableNotes,
        selectedNote,
        handleCreateNote,
        handleDragEnd,
        updateNoteSize,
        openNoteById,
        closeNoteModal,
        handleUpdateNote,
        handleDeleteNote,
        setTableNotes,
    };
}
