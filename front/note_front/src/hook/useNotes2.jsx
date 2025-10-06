import { useEffect, useState } from 'react';
import { useNotes } from '../hook/useNote';
import { clampToGrid, randomPosInGrid } from '../utils/gridBounds';

export function useNotes2({ gridSize, selectedGrid, navigate }) {
  const { getByUserId, createNotes, notes } = useNotes();

  const [tableNotes, setTableNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  // localStorage helpers for grid association
  const setNoteGrid = (noteId, gridId) => {
    try {
      const mapStr = localStorage.getItem('noteGridMap');
      const noteGridMap = mapStr ? JSON.parse(mapStr) : {};
      noteGridMap[noteId] = gridId;
      localStorage.setItem('noteGridMap', JSON.stringify(noteGridMap));
    } catch {}
  };
  const removeNoteGrid = (noteId) => {
    try {
      const mapStr = localStorage.getItem('noteGridMap');
      const noteGridMap = mapStr ? JSON.parse(mapStr) : {};
      if (noteGridMap[noteId]) {
        delete noteGridMap[noteId];
        localStorage.setItem('noteGridMap', JSON.stringify(noteGridMap));
      }
    } catch {}
  };

  // Fetch notes on mount
  useEffect(() => {
    const fetchUserNotes = async () => {
      const userId = sessionStorage.getItem('id_user');
      if (!userId) {
        navigate('/connexion');
        return;
      }
      try {
        const response = await getByUserId(userId);
        // handle both axios response and direct array
        const apiNotes = (response && response.data) ? response.data : (Array.isArray(response) ? response : (notes || []));
        const mapStr = localStorage.getItem('noteGridMap');
        const noteGridMap = mapStr ? JSON.parse(mapStr) : {};
        const mapped = apiNotes.map((note) => ({
          id: note.id.toString(),
          title: note.title,
          content: note.content,
          contentPreview: (note.content || '').substring(0, 50),
          creationDate: new Date(note.date).toISOString().split('T')[0],
          gridId: noteGridMap[note.id] || null,
          position: randomPosInGrid(undefined, gridSize),
        }));
        setTableNotes((prev) => {
          const prevById = new Map(prev.map((n) => [n.id, n]));
          return mapped.map((n) => {
            const old = prevById.get(n.id);
            return old ? { ...old, ...n, position: old.position || n.position, size: old.size || n.size } : n;
          });
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des notes:', err);
      }
    };
    fetchUserNotes();
  }, [navigate]);

  // Reclamp on grid size change and window resize
  useEffect(() => {
    setTableNotes((prev) => prev.map((n) => ({
      ...n,
      position: clampToGrid(n.position, n.size, gridSize),
    })));
  }, [gridSize.width, gridSize.height]);

  useEffect(() => {
    const onResize = () => {
      setTableNotes((prev) => prev.map((n) => ({
        ...n,
        position: clampToGrid(n.position, n.size, gridSize),
      })));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [gridSize]);

  const updateNoteSize = (id, size) => {
    setTableNotes((prev) => {
      let changed = false;
      const next = prev.map((n) => {
        if (n.id !== id) return n;
        const sameSize = n.size && n.size.w === size.w && n.size.h === size.h;
        const newPos = clampToGrid(n.position, size, gridSize);
        const samePos = n.position.x === newPos.x && n.position.y === newPos.y;
        if (sameSize && samePos) return n;
        changed = true;
        return { ...n, size, position: newPos };
      });
      return changed ? next : prev;
    });
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const id = active.id;
    setTableNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              position: clampToGrid(
                {
                  x: note.position.x + delta.x,
                  y: note.position.y + delta.y,
                },
                note.size,
                gridSize
              ),
            }
          : note
      )
    );
  };

  const handleCreateNote = async ({ title, content }) => {
    const userId = sessionStorage.getItem('id_user');
    if (!userId) {
      navigate('/connexion');
      return;
    }
    const newNoteData = {
      title,
      content,
      date: new Date().toISOString(),
      user: { id: userId },
    };
    try {
      const response = await createNotes(newNoteData);
      const createdNote = response.data;
      const randPos = randomPosInGrid(undefined, gridSize);
      const noteForFront = {
        id: createdNote.id.toString(),
        title: createdNote.title,
        content: createdNote.content,
        contentPreview: (createdNote.content || '').substring(0, 50),
        creationDate: new Date(createdNote.date).toISOString().split('T')[0],
        gridId: selectedGrid?.id || null,
        position: randPos,
      };
      setTableNotes((prev) => [...prev, noteForFront]);
      setSelectedNote(noteForFront);
      if (selectedGrid?.id) setNoteGrid(createdNote.id, selectedGrid.id);
    } catch (err) {
      console.error('Erreur lors de la création de la note:', err);
    }
  };

  const openNoteById = (id) => {
    const note = tableNotes.find((n) => n.id === id);
    if (note) setSelectedNote(note);
  };

  const closeNoteModal = () => setSelectedNote(null);

  return {
    tableNotes,
    setTableNotes,
    selectedNote,
    setSelectedNote,
    updateNoteSize,
    handleDragEnd,
    handleCreateNote,
    openNoteById,
    closeNoteModal,
    setNoteGrid,
    removeNoteGrid,
  };
}
