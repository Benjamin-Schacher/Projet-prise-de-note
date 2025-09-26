import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteSidebar from '../components/notes/NoteSidebar';
import GridCanvas from '../components/grid/GridCanvas';
import Button from '../components/ui/Button'; // Ajout de l'import manquant

export const Note = () => {
    const [groups, setGroups] = useState([
        {
            id: uuidv4(),
            name: 'Groupe 1',
            grids: [
                { id: uuidv4(), name: 'Grille 1', size: { width: 600, height: 400 } }
            ]
        }
    ]);

    const [selectedGrid, setSelectedGrid] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [startSize, setStartSize] = useState({ width: 0, height: 0 });
    const cellSize = 30;

    // Fonction pour renommer un groupe
    const renameGroup = (groupId, newName) => {
        if (!newName.trim()) return;
        setGroups(groups.map(group =>
            group.id === groupId ? { ...group, name: newName } : group
        ));
    };

    // Gestion du redimensionnement
    const startResize = (e) => {
        if (!selectedGrid?.size) return;
        e.preventDefault();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY
        });
        setStartSize({
            width: selectedGrid.size?.width || 600,
            height: selectedGrid.size?.height || 400
        });
    };

    const handleResize = useCallback((e) => {
        if (!isResizing || !selectedGrid?.size) return;

        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;

        const newWidth = Math.max(600, startSize.width + dx);
        const newHeight = Math.max(400, startSize.height + dy);

        setSelectedGrid(prev => ({
            ...prev,
            size: {
                ...prev.size,
                width: newWidth,
                height: newHeight
            }
        }));
    }, [isResizing, selectedGrid, resizeStart.x, resizeStart.y, startSize.width, startSize.height]);

    const stopResize = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleResize);
            window.addEventListener('mouseup', stopResize);
            return () => {
                window.removeEventListener('mousemove', handleResize);
                window.removeEventListener('mouseup', stopResize);
            };
        }
    }, [isResizing, handleResize, stopResize]);

    // Sélectionner la première grille au chargement
    useEffect(() => {
        if (groups.length > 0 && groups[0]?.grids?.length > 0 && !selectedGrid) {
            const firstGrid = groups[0].grids[0];
            if (firstGrid && !firstGrid.size) {
                firstGrid.size = { width: 600, height: 400 };
            }
            setSelectedGrid(firstGrid);
        }
    }, [groups]);

    const gridCols = selectedGrid?.size?.width ? Math.floor(selectedGrid.size.width / cellSize) : 20;
    const gridRows = selectedGrid?.size?.height ? Math.floor(selectedGrid.size.height / cellSize) : 15;
    const gridWidth = selectedGrid?.size?.width || 600;
    const gridHeight = selectedGrid?.size?.height || 400;

    const addGroup = () => {
        const newGroup = {
            id: uuidv4(),
            name: 'Nouveau Groupe',
            grids: []
        };
        setGroups([...groups, newGroup]);
    };

    const deleteGroup = (groupId) => {
        setGroups(groups.filter(group => group.id !== groupId));
    };

    const addGrid = (groupId) => {
        const newGrid = {
            id: uuidv4(),
            name: 'Nouvelle Grille',
            size: { width: 600, height: 400 }
        };

        setGroups(groups.map(group =>
            group.id === groupId
                ? { ...group, grids: [...group.grids, newGrid] }
                : group
        ));

        setSelectedGrid(newGrid);
    };

    const deleteGrid = (groupId, gridId) => {
        setGroups(groups.map(group => {
            if (group.id === groupId) {
                const newGrids = group.grids.filter(grid => grid.id !== gridId);
                return { ...group, grids: newGrids };
            }
            return group;
        }));
    };

    if (!selectedGrid) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">Aucune grille disponible</p>
                    <button
                        onClick={() => {
                            if (groups.length === 0) {
                                const newGroup = {
                                    id: uuidv4(),
                                    name: 'Nouveau Groupe',
                                    grids: []
                                };
                                setGroups([newGroup]);
                                addGrid(newGroup.id);
                            } else {
                                addGrid(groups[0].id);
                            }
                        }}
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
        <div className="flex flex-col" style={{ minHeight: `calc(100vh - ${navbarHeight})`, marginTop: navbarHeight }}>
            <div className="flex flex-1">
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

                <div className="flex-1" style={{ marginLeft: '16rem' }}>
                    <GridCanvas
                        selectedGrid={selectedGrid}
                        isResizing={isResizing}
                        onStartResize={startResize}
                    />

                    {isResizing && (
                        <div
                            className="fixed inset-0 z-50 cursor-nwse-resize"
                            onMouseMove={handleResize}
                            onMouseUp={stopResize}
                        ></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Note;
