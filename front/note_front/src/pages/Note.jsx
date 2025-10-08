import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteSidebar from '../components/notes/NoteSidebar';
import GridCanvas from '../components/grid/GridCanvas';
import { DndContext } from '@dnd-kit/core';
import DraggableNote from '../components/notes/DraggableNote.jsx';
import { NoteVue } from '../components/NoteVue.jsx';
import ModalInGrid from '../components/common/ModalInGrid.jsx';
import { useGrids } from '../hook/useGrids';
import { useNotes2 } from '../hook/useNotes2';


export const Note = () => {
    const navigate = useNavigate();
    const DEFAULT_GRID_SIZE = { width: 800, height: 600 };
    const {
        groups,
        setGroups,
        selectedGrid,
        setSelectedGrid,
        gridSize,
        renameGroup,
        renameGrid,
        addGroup,
        addGrid,
        deleteGrid: deleteGridCore,
        deleteGroup: deleteGroupCore,
        handleAddFirstGrid,
        updateGridSize,
    } = useGrids(DEFAULT_GRID_SIZE);

    const {
        tableNotes,
        setTableNotes,
        selectedNote,
        updateNoteSize,
        handleDragEnd,
        handleCreateNote,
        openNoteById,
        closeNoteModal,
        handleUpdateNote,
        handleDeleteNote,
    } = useNotes2({ gridSize, selectedGrid, navigate });

    const [newNoteTitle, setNewNoteTitle] = useState('titre');
    const [newNoteContent, setNewNoteContent] = useState('contenue');


    // --- Créer une note
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
                    onDeleteGroup={deleteGroupCore}
                    onRenameGroup={renameGroup}
                    onAddGrid={addGrid}
                    onDeleteGrid={deleteGridCore}
                    onRenameGrid={renameGrid}
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
                                content={selectedNote.content}
                                creationDate={selectedNote.creationDate}
                                onClose={closeNoteModal}
                                onUpdate={async (updatedNote) => {
                                    // on retrouve la note actuelle dans le tableau
                                    const currentNote = tableNotes.find(n => n.id === updatedNote.id);

                                    // si la position n’est pas envoyée, on garde l’ancienne
                                    const safePosition = updatedNote.position || currentNote?.position || { x: 0, y: 0 };

                                    const finalNote = {
                                        ...updatedNote,
                                        pos_x: safePosition.x,
                                        pos_y: safePosition.y
                                    };

                                    await handleUpdateNote(finalNote);

                                    setTableNotes(prev =>
                                        prev.map(n =>
                                            n.id === updatedNote.id
                                                ? {
                                                    ...n,
                                                    ...updatedNote,
                                                    position: safePosition, // 🔽 garde la position actuelle
                                                    contentPreview: (updatedNote.content || "").substring(0, 50)
                                                }
                                                : n
                                        )
                                    );
                                }}
                                onDeleteNote={handleDeleteNote} // <-- passe la fonction
                            />
                        </ModalInGrid>
                    )}
                </div>
            </div>
        </div>
    );
};
