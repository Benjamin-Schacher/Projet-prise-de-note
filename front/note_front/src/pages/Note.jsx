import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteSidebar from '../components/notes/NoteSidebar';
import GridCanvas from '../components/grid/GridCanvas';

export const Note = () => {
    // Taille par défaut pour les nouvelles grilles
const DEFAULT_GRID_SIZE = { width: 800, height: 600 };
const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);

    //composant groups avec un id unique et un nom et une liste de grilles + la taille de la grille garder en mémoire
    const [groups, setGroups] = useState([
        {
            id: uuidv4(),
            name: 'Groupe 1',
            grids: [
                { 
                    id: uuidv4(), 
                    name: 'Grille 1',
                    size: { ...DEFAULT_GRID_SIZE }
                }
            ]
        }
    ]);

    const [selectedGrid, setSelectedGrid] = useState(null);

    // Fonction pour renommer un group
    const renameGroup = (groupId, newName) => {
        if (!newName.trim()) return;
        setGroups(groups.map(group =>
            group.id === groupId ? { ...group, name: newName } : group
        ));
    };


    // Mettre à jour la taille de la grille lorsque la grille sélectionnée change
    useEffect(() => {
        if (selectedGrid) {
            setGridSize(selectedGrid.size || DEFAULT_GRID_SIZE);
        }
    }, [selectedGrid]);
    
    // Sélectionner la première grille au chargement
    useEffect(() => {
        if (groups.length > 0 && groups[0]?.grids?.length > 0 && !selectedGrid) {
            const firstGrid = groups[0].grids[0];
            setSelectedGrid(firstGrid);
        }
    }, [groups]);

 // Fonction pour ajouter un group

    const addGroup = () => {
        const newGroup = {
            id: uuidv4(),
            name: 'Nouveau Groupe',
            grids: []
        };
        setGroups([...groups, newGroup]);
    };

    // Fonction pour supprimer un group
    const deleteGroup = (groupId) => {
        // Vérifier si le groupe à supprimer contient la grille actuellement sélectionnée
        const groupToDelete = groups.find(g => g.id === groupId);
        const isSelectedGridInDeletedGroup = groupToDelete?.grids.some(grid => grid.id === selectedGrid?.id);
        
        // Filtrer les groupes pour supprimer celui qui correspond
        const updatedGroups = groups.filter(group => group.id !== groupId);
        
        // Mettre à jour les groupes
        setGroups(updatedGroups);
        
        // Si la grille sélectionnée était dans le groupe supprimé
        if (isSelectedGridInDeletedGroup) {
            // Trouver une nouvelle grille à sélectionner dans les groupes restants
            const firstAvailableGrid = updatedGroups.flatMap(g => g.grids)[0];
            setSelectedGrid(firstAvailableGrid || null);
        }
    };

    // Fonction pour ajouter une grille
    const addGrid = (groupId) => {
        const newGrid = {
            id: uuidv4(),
            name: `Grille ${groups.find(g => g.id === groupId).grids.length + 1}`,
            size: { ...DEFAULT_GRID_SIZE }
        };
//assigner la nouvelle grille au groupe
        setGroups(groups.map(group =>
            group.id === groupId
                ? { ...group, grids: [...group.grids, newGrid] }
                : group
        ));

        setSelectedGrid(newGrid);
    };

    // Fonction pour supprimer une grille d'un group
    const deleteGrid = (groupId, gridId) => {
        setGroups(groups.map(group => {
            if (group.id === groupId) {
                const newGrids = group.grids.filter(grid => grid.id !== gridId);

                // Si la grille supprimée est celle qui est actuellement sélectionnée
                if (selectedGrid && selectedGrid.id === gridId) {
                    // Trouver une autre grille à sélectionner
                    const otherGroups = groups.filter(g => g.id !== groupId);
                    const otherGrids = group.grids.filter(g => g.id !== gridId);

                    if (otherGrids.length > 0) {
                        // Sélectionner une autre grille du même groupe
                        setSelectedGrid(otherGrids[0]);
                    } else if (otherGroups.length > 0 && otherGroups[0].grids.length > 0) {
                        // Sinon, sélectionner la première grille du premier groupe disponible
                        setSelectedGrid(otherGroups[0].grids[0]);
                    } else {
                        // Sinon, ne plus rien sélectionner
                        setSelectedGrid(null);
                    }
                }

                return { ...group, grids: newGrids };
            }
            return group;
        }));
    };

    // ajout grille + group lorsqu'il n'y a rien
    const handleAddFirstGrid = () => {
        let targetGroupId;
        
        // Si aucun groupe n'existe, on en crée un nouveau
        if (groups.length === 0) {
            const newGroup = {
                id: uuidv4(),
                name: 'Nouveau Groupe',
                grids: []
            };
            targetGroupId = newGroup.id;
            setGroups([newGroup]);
        } else {
            // Sinon on utilise le premier groupe disponible
            targetGroupId = groups[0].id;
        }
        
        // Création d'une nouvelle grille dans le groupe cible
        const newGrid = {
            id: uuidv4(),
            name: 'Nouvelle Grille',
            size: { ...DEFAULT_GRID_SIZE }
        };
        
        setGroups(currentGroups => 
            currentGroups.map(group => 
                group.id === targetGroupId
                    ? { ...group, grids: [...group.grids, newGrid] }
                    : group
            )
        );
        
        // Sélection de la nouvelle grille
        setSelectedGrid(newGrid);
    };

    const updateGridSize = (newSize) => {
        if (!selectedGrid) return;
        
        setGroups(groups.map(group => ({
            ...group,
            grids: group.grids.map(grid => 
                grid.id === selectedGrid.id 
                    ? { ...grid, size: { ...grid.size, ...newSize } } 
                    : grid
            )
        })));
        
        setGridSize(prevSize => ({
            ...prevSize,
            ...newSize
        }));
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
                    />
                </div>
            </div>
        </div>
    );
};
