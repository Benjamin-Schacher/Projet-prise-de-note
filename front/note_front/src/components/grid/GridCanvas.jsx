import React, { useCallback, useEffect } from 'react';

const GridCanvas = ({
  selectedGrid,
  isResizing,
  onStartResize,
  cellSize = 30,
}) => {
  const gridCols = selectedGrid?.size?.width ? Math.floor(selectedGrid.size.width / cellSize) : 20;
  const gridRows = selectedGrid?.size?.height ? Math.floor(selectedGrid.size.height / cellSize) : 15;
  const gridWidth = selectedGrid?.size?.width || 600;
  const gridHeight = selectedGrid?.size?.height || 400;

  // Rendu de la grille
  const renderGrid = useCallback(() => {
    return (
      <div 
        className="relative rounded overflow-hidden"
        style={{
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          backgroundColor: '#fffd98',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 0 rgba(0,0,0,0.05)',
        }}
      >
        {/* Contenu de la grille ici */}
        
        {/* Poignée de redimensionnement */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
          onMouseDown={onStartResize}
          style={{ cursor: isResizing ? 'se-resize' : 'default' }}
        />
      </div>
    );
  }, [gridWidth, gridHeight, cellSize, isResizing, onStartResize]);

  return (
    <div className="flex-1 p-6 overflow-auto">
      {selectedGrid ? (
        <div className="flex flex-col items-start">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">{selectedGrid.name}</h2>
            <p className="text-gray-400 text-sm">
              {gridCols} × {gridRows} cellules
            </p>
          </div>
          {renderGrid()}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Sélectionnez une grille pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default GridCanvas;
