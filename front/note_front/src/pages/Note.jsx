import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteSidebar from '../components/notes/NoteSidebar';
import GridCanvas from '../components/grid/GridCanvas';

export const Note = () => {
    const [gridSize, setGridSize] = useState({ width: 800, height: 600 });
    
    const [groups, setGroups] = useState([
        {
            id: uuidv4(),
            name: 'Groupe 1',
            grids: [
                { id: uuidv4(), name: 'Grille 1' }
            ]
        }
    ]);

    const [selectedGrid, setSelectedGrid] = useState(null);

    // Fonction pour renommer un groupe
    const renameGroup = (groupId, newName) => {
        if (!newName.trim()) return;
        setGroups(groups.map(group =>
            group.id === groupId ? { ...group, name: newName } : group
        ));
    };


    // Sélectionner la première grille au chargement
    useEffect(() => {
        if (groups.length > 0 && groups[0]?.grids?.length > 0 && !selectedGrid) {
            const firstGrid = groups[0].grids[0];
            setSelectedGrid(firstGrid);
        }
    }, [groups]);


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
            name: 'Nouvelle Grille'
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
                        onSizeChange={(newSize) => setGridSize(newSize)}
                    />
                </div>
            </div>
        </div>
    );
};
