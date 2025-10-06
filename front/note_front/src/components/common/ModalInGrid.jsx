import React from 'react';

// Centers children within the same visual bounds as the grid area
// Avoids overlapping sidebar/header by using fixed offsets identical to GridCanvas
export default function ModalInGrid({ children, zIndex = 200 }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '12rem',
        left: '16rem',
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
