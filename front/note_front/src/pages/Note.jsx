import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteSidebar from '../components/notes/NoteSidebar';
import GridCanvas from '../components/grid/GridCanvas';
import { useNotes } from '../hook/useNote';
import { DndContext } from '@dnd-kit/core';
import DraggableNote from '../components/notes/DraggableNote.jsx';
import { NoteVue } from '../components/NoteVue.jsx';
import ModalInGrid from '../components/common/ModalInGrid.jsx';
import { useGrids } from '../hook/useGrids';
import { useNotes2 } from '../hook/useNotes2';

export const Note = () => {
    const navigate = useNavigate();
    
    // Hook pour gérer les notes
    const {
        deleteNote
    } = useNotes();
    
    // Taille par défaut pour les nouvelles grilles
    const DEFAULT_GRID_SIZE = { width: 800, height: 600 };
    const {
        groups,
        setGroups,
        selectedGrid,
        setSelectedGrid,
        gridSize,
        renameGroup,
        addGroup,
        addGrid,
        deleteGrid: deleteGridCore,
        deleteGroup: deleteGroupCore,
        handleAddFirstGrid,
        updateGridSize,
    } = useGrids(DEFAULT_GRID_SIZE);

    // Notes via hook useNotes2
    const {
        tableNotes,
        setTableNotes,
        selectedNote,
        setSelectedNote,
        updateNoteSize,
        handleDragEnd,
        handleCreateNote,
        openNoteById,
        closeNoteModal,
        removeNoteGrid,
    } = useNotes2({ gridSize, selectedGrid, navigate });

    const [newNoteTitle, setNewNoteTitle] = useState('titre');
    const [newNoteContent, setNewNoteContent] = useState('contenue');

    // Suppression groupe avec nettoyage notes (backend + local)
    const deleteGroup = async (groupId) => {
        const groupToDelete = groups.find(g => g.id === groupId);
        const gridIdsToRemove = (groupToDelete?.grids || []).map(g => g.id);
        if (gridIdsToRemove.length > 0) {
            const noteIdsToDelete = tableNotes.filter(n => gridIdsToRemove.includes(n.gridId)).map(n => n.id);
            if (noteIdsToDelete.length > 0) {
                try { await Promise.allSettled(noteIdsToDelete.map((nid) => deleteNote(nid))); } catch (e) { console.error('Erreur suppression notes (backend):', e); }
            }
            setTableNotes(prev => {
                const toRemoveIds = new Set(prev.filter(n => gridIdsToRemove.includes(n.gridId)).map(n => n.id));
                try {
                    const mapStr = localStorage.getItem('noteGridMap');
                    const noteGridMap = mapStr ? JSON.parse(mapStr) : {};
                    for (const nid of toRemoveIds) delete noteGridMap[nid];
                    localStorage.setItem('noteGridMap', JSON.stringify(noteGridMap));
                } catch {}
                if (selectedNote && toRemoveIds.has(selectedNote.id)) setSelectedNote(null);
                return prev.filter(n => !toRemoveIds.has(n.id));
            });
        }
        deleteGroupCore(groupId);
    };

    // Fonction pour supprimer une grille d'un group (et ses notes associées)
    const deleteGrid = async (groupId, gridId) => {
        const noteIdsToDelete = tableNotes.filter(n => n.gridId === gridId).map(n => n.id);
        if (noteIdsToDelete.length > 0) {
            try { await Promise.allSettled(noteIdsToDelete.map((nid) => deleteNote(nid))); } catch (e) { console.error('Erreur suppression notes (backend):', e); }
        }
        setTableNotes(prev => {
            const toRemoveIds = new Set(prev.filter(n => n.gridId === gridId).map(n => n.id));
            try {
                const mapStr = localStorage.getItem('noteGridMap');
                const noteGridMap = mapStr ? JSON.parse(mapStr) : {};
                for (const nid of toRemoveIds) delete noteGridMap[nid];
                localStorage.setItem('noteGridMap', JSON.stringify(noteGridMap));
            } catch {}
            if (selectedNote && toRemoveIds.has(selectedNote.id)) setSelectedNote(null);
            return prev.filter(n => n.gridId !== gridId);
        });
        deleteGridCore(groupId, gridId);
    };

    // Fonction pour créer une nouvelle note
    const onCreateNote = async () => {
        await handleCreateNote({ title: newNoteTitle, content: newNoteContent });
    };

    if (!selectedGrid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Aucune grille disponible</p>
                    <button
                        onClick={handleAddFirstGrid}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                        + Ajouter une grille
                    </button>
                </div>
            </div>
        );
    }

    const navbarHeight = '64px';

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden" style={{ marginTop: navbarHeight }}>
                <NoteSidebar
                    groups={groups}
                    selectedGrid={selectedGrid}
                    onSelectGrid={(grid, groupId) => setSelectedGrid({ ...grid, groupId })}
                    onAddGroup={addGroup}
                    onDeleteGroup={deleteGroup}
                    onRenameGroup={renameGroup}
                    onAddGrid={addGrid}
                    onDeleteGrid={deleteGrid}
                    setGroups={setGroups}
                    setSelectedGrid={setSelectedGrid}
                />

                <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: '16rem' }}>
                    <GridCanvas 
                        selectedGrid={selectedGrid} 
                        width={gridSize.width}
                        height={gridSize.height}
                        onSizeChange={updateGridSize}
                        renderActions={() => (
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                onClick={onCreateNote}
                            >
                                + Créer une note
                            </button>
                        )}
                    />
                    {/* Zone d'affichage des notes */}
                    <DndContext onDragEnd={handleDragEnd}>
                        <div>
                            {tableNotes
                                .filter((n) => !selectedGrid || n.gridId === selectedGrid.id)
                                .map((note) => (
                                <DraggableNote
                                    key={note.id}
                                    id={note.id}
                                    title={note.title}
                                    contentPreview={note.contentPreview}
                                    position={note.position}
                                    onSize={updateNoteSize}
                                    onOpen={openNoteById}
                                />
                            ))}
                        </div>
                    </DndContext>
                    {selectedNote && (
                        <ModalInGrid>
                            <NoteVue
                                note_id={selectedNote.id}
                                title={selectedNote.title}
                                creationDate={selectedNote.creationDate}
                                content={selectedNote.content}
                                onClose={closeNoteModal}
                                onDeleteNote={(noteId) => {
                                    setTableNotes((prev) => prev.filter((n) => n.id !== noteId));
                                    setSelectedNote(null);
                                    removeNoteGrid(noteId);
                                }}
                                onUpdate={(updatedNote) => {
                                    setTableNotes((prev) =>
                                        prev.map((n) =>
                                            n.id === updatedNote.id
                                                ? { ...n, ...updatedNote, contentPreview: updatedNote.content.substring(0, 50) }
                                                : n
                                        )
                                    );
                                }}
                            />
                        </ModalInGrid>
                    )}
                </div>
            </div>
        </div>
    );
};
