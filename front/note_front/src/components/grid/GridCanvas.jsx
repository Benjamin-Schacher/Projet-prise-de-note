import React, { useCallback, useState, useEffect } from 'react';

const GridCanvas = ({
                        selectedGrid, //action de cliquer sur une grille
                        cellSize = 30, // taille de chaque cellule de la grille
                        width = 800,  //taille de base de la grille
                        height = 600,
                        onSizeChange = ({}) => {}, // fonction de callback pour gérer les changements de taille
                        renderActions = null, // rendu optionnel d'actions dans l'entête
                    }) => {
    const [localWidth, setLocalWidth] = useState(width); //useState pour stocker la taille locale
    const [localHeight, setLocalHeight] = useState(height);

    // Mettre à jour les états locaux quand les props changent
    useEffect(() => {
        setLocalWidth(width);
    }, [width]);

    useEffect(() => {
        setLocalHeight(height);
    }, [height]);


    const gridWidth = width; // largeur de la grille
    const gridHeight = height; // hauteur de la grille

    // Rendu du grillage
    const renderGrid = useCallback(() => {
        return (
            <div
                className="relative rounded overflow-hidden"
                style={{
                    width: `${gridWidth}px`, //grillage dynamique en fonction de la taille de la grille
                    height: `${gridHeight}px`,
                    //style du grillage
                    backgroundImage:  `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
                    backgroundSize: `${cellSize}px ${cellSize}px`,
                    backgroundColor: '#fffd98',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 0 rgba(0,0,0,0.05)',
                }}
            >
            </div>
        );
    }, [gridWidth, gridHeight, cellSize]);

    // bloc du haut avec le nom de la grille et les boutons de modification de la taille
    return (
        <div className="flex-1 flex flex-col h-full">
            {selectedGrid ? (
                <>
                    <div className="p-6 pb-2 bg-gray-900 border-b border-gray-700 fixed left-64 right-0 top-0 h-32 z-10">
                        <h2 className="text-xl font-semibold text-white mb-2">{selectedGrid.name}</h2>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <label className="text-white mr-2 text-sm">Largeur:</label>
                                <input
                                    type="number"
                                    value={localWidth}
                                    //gestion de la modification de la taille de la grille min 100 max 2000 pour les deux valeurs
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const numValue = Number(value); // convertir en number

                                        setLocalWidth(numValue);

                                        if (!isNaN(numValue) && numValue >= 100 && numValue <= 2000) {
                                            onSizeChange({ width: numValue, height: localHeight });
                                        }
                                    }}
                                    onBlur={(e) => { //quand on sort du champ de saisie, on vérifie que la valeur est valide.
                                        let numValue = Number(e.target.value);
                                        if (isNaN(numValue) || numValue < 100) numValue = 100;
                                        else if (numValue > 2000) numValue = 2000;

                                        setLocalWidth(numValue);
                                        onSizeChange({ width: numValue, height: localHeight });
                                    }}
                                    className="w-20 px-2 py-1 rounded bg-gray-700 text-white text-sm"
                                    min="100"
                                    max="2000"
                                />
                                <span className="ml-1 text-gray-400 text-sm">px</span>
                            </div>
                            <div className="flex items-center">
                                <label className="text-white mr-2 text-sm">Hauteur:</label>
                                <input
                                    type="number"
                                    value={localHeight}
                                    onChange={(e) => { //meme chose que pour la largeur
                                        const value = e.target.value;
                                        const numValue = Number(value);

                                        setLocalHeight(numValue);

                                        if (!isNaN(numValue) && numValue >= 100 && numValue <= 2000) {
                                            onSizeChange({ width: localWidth, height: numValue });
                                        }
                                    }}
                                    onBlur={(e) => {
                                        let numValue = Number(e.target.value);
                                        if (isNaN(numValue) || numValue < 100) numValue = 100;
                                        else if (numValue > 2000) numValue = 2000;

                                        setLocalHeight(numValue);
                                        onSizeChange({ width: localWidth, height: numValue });
                                    }}

                                    className="w-20 px-2 py-1 rounded bg-gray-700 text-white text-sm"
                                    min="100"
                                    max="2000"
                                />
                                <span className="ml-1 text-gray-400 text-sm">px</span>
                            </div>
                            {typeof renderActions === 'function' ? (
                                <div className="ml-auto flex items-center space-x-2">
                                    {renderActions()}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {/* bloc de la grille style*/}
                    <div style={{
                        position: 'fixed',
                        top: '12rem',
                        left: '16rem',
                        right: 0,
                        bottom: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}>
                        {/*grille style*/}
                        <div style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            overflow: 'auto',
                            padding: '1rem',
                            boxSizing: 'border-box'
                        }}>
                            {renderGrid()}
                        </div>
                    </div>
                </>
                // si pas de grille selectionner affiche un message
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400">Sélectionnez une grille pour commencer</p>
                </div>
            )}
        </div>
    );
};

export default GridCanvas;
