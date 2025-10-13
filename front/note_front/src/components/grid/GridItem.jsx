import React, { useState, useEffect, useRef } from 'react';

const GridItem = ({ grid, isSelected, onSelect, onDelete, onRename }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(grid.name);
    const inputRef = useRef(null);

    // control du renommage

    const handleRename = (e) => {
        e && e.stopPropagation(); // empêche la propagation de l'événement
        if (newName.trim() && newName !== grid.name) { // vérifie que le nouveau nom est valide et différent du nom actuel
            onRename(newName); // appelle la fonction de renommage
        }
        setIsRenaming(false); // termine le renommage
    };

    // gestion du focus

    useEffect(() => {
        if (isRenaming && inputRef.current) { // si le renommage est actif et que le ref est disponible
            inputRef.current.focus(); // met le focus sur l'input
            inputRef.current.select(); // sélectionne le texte
        }
    }, [isRenaming]);

    //rendu

    return (
        <div
            className={`p-2 m-1 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 ${
                isSelected // applique des styles si la grille est sélectionnée
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200'
            }`}
            onClick={onSelect} // selectionne la grille
        >
            {isRenaming ? (
                <input
                    ref={inputRef} //reference de l'input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)} // met à jour le nouveau nom a chaque changement
                    onBlur={handleRename}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(e)} // appelle la fonction de renommage lors de la touche enter
                    className="bg-gray-600 text-white px-2 py-1 rounded text-sm w-full"
                    onClick={(e) => e.stopPropagation()} // empêche la propagation de l'événement
                />
            ) : (
                <span
                    className={`font-medium flex-grow ${isSelected ? 'text-white' : 'text-gray-200'}`} //change la couleur du texte si la grille est sélectionnée
                    onDoubleClick={(e) => { // double clic pour renommer
                        e.stopPropagation();
                        setIsRenaming(true);
                    }}
                >
          {grid.name}
        </span>
            )}
            {/* bouton de suppression*/}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette grille ?')) { //confirmation de la suppression
                        onDelete(); //supprime la grille
                    }
                }}
                className="text-red-400 hover:text-red-300 ml-2 text-sm"
                title="Supprimer la grille"
            >
                ×
            </button>
        </div>
    );
};

export default GridItem;
