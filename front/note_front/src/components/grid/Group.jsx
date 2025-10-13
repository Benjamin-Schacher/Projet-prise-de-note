import React, { useState, useRef, useEffect } from 'react';
import GridItem from './GridItem';

// definition du composant group

const Group = ({
                   group,
                   onSelect,
                   onDelete,
                   onRename,
                   selectedGrid,
                   onAddGrid,
                   onDeleteGrid,
                   onRenameGrid,
                   setSelectedGrid
               }) => {
    // gère le renommage du groupe et le focus sur l'input
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(group.name);
    const [addingDisabled, setAddingDisabled] = useState(false);
    const inputRef = useRef(null);
// gère la confirmation du renommage
    const handleRename = () => {
        if (newName.trim() && newName !== group.name) {
            onRename(group.id, newName);
        }
        setIsRenaming(false);
    };

    // gère le focus sur l'input

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    //rendu des groupes

    return (
        <div className="mb-4 bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        type="text"
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-full"
                    />
                ) : (
                    <h3
                        className="text-md font-semibold text-white cursor-pointer"
                        onDoubleClick={() => setIsRenaming(true)} // double clic pour renommer
                    >
                        {group.name}
                    </h3>
                )}
                {/* boutons d'actions suprimer et ajouter une grille */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            if (addingDisabled) return;
                            setAddingDisabled(true);
                            onAddGrid(group.id);
                            // brief debounce to avoid duplicate first click
                            setTimeout(() => setAddingDisabled(false), 600);
                        }}
                        disabled={addingDisabled}
                        className={`text-xs px-2 py-1 rounded ${addingDisabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        title="Ajouter une grille"
                    >
                        + Grille
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe et toutes ses grilles ?')) {
                                onDelete(group.id);
                            }
                        }}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        title="Supprimer le groupe"
                    >
                        ×
                    </button>
                </div>
            </div>
            {/* liste des grilles du groupe et gère les actions de sélection, suppression et renommage */}
            <div className="ml-2 border-l-2 border-gray-600 pl-3">
                {group.grids.map((grid) => (
                    <GridItem
                        key={grid.id}
                        grid={grid}
                        isSelected={selectedGrid?.id === grid.id}
                        onSelect={() => onSelect(grid, group.id)}
                        onDelete={() => onDeleteGrid(group.id, grid.id)}
                        onRename={(newName) => {
                            onRenameGrid?.(group.id, grid.id, newName);
                            if (selectedGrid?.id === grid.id) {
                                setSelectedGrid({ ...grid, name: newName });
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Group;
