import React, { useCallback } from 'react';

const GridCanvas = ({
  selectedGrid,
  cellSize = 30,
  width = 800,
  height = 600,
  onSizeChange = () => {}
}) => {
  const gridWidth = width;
  const gridHeight = height;

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
        
      </div>
    );
  }, [gridWidth, gridHeight, cellSize]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {selectedGrid ? (
        <>
          <div className="p-6 pb-2 bg-gray-900 border-b border-gray-700 fixed left-64 right-0 top-16 h-32 z-10">
            <h2 className="text-xl font-semibold text-white mb-2">{selectedGrid.name}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="text-white mr-2 text-sm">Largeur:</label>
                <input 
                  type="number" 
                  value={width}
                  onChange={(e) => {
                    const newWidth = parseInt(e.target.value) || 100;
                    if (newWidth >= 100 && newWidth <= 2000) {
                      onSizeChange({ width: newWidth, height });
                    }
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
                  value={height}
                  onChange={(e) => {
                    const newHeight = parseInt(e.target.value) || 100;
                    if (newHeight >= 100 && newHeight <= 2000) {
                      onSizeChange({ width, height: newHeight });
                    }
                  }}
                  className="w-20 px-2 py-1 rounded bg-gray-700 text-white text-sm"
                  min="100"
                  max="2000"
                />
                <span className="ml-1 text-gray-400 text-sm">px</span>
              </div>
            </div>
          </div>
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
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Sélectionnez une grille pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default GridCanvas;
