import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { NoteOnBoard } from '../NoteOnBoard.jsx';

export default function DraggableNote({ id, title, contentPreview, position, onSize, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const [measured, setMeasured] = React.useState({ w: null, h: null });
  const nodeRef = React.useRef(null);

  const setRefs = (node) => {
    setNodeRef(node);
    nodeRef.current = node;
  };

  const outerStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.1 : 1})`
      : isDragging
      ? 'scale(1.1)'
      : undefined,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    zIndex: isDragging ? 100 : 'auto',
  };

  const innerStyle = {
    boxShadow: isDragging ? '0 10px 30px rgba(0,0,0,0.3)' : '0 5px 10px rgba(0,0,0,0.1)',
    display: 'inline-block',
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    animation: isDragging ? 'wiggle-rotate 1s infinite' : 'none',
  };

  React.useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = { w: Math.round(rect.width), h: Math.round(rect.height) };
    if (size.w !== measured.w || size.h !== measured.h) {
      setMeasured(size);
      onSize?.(id, size);
    }
  }, []);

  return (
    <div ref={setRefs} style={outerStyle}>
      <div style={innerStyle}>
        <NoteOnBoard
          title={title}
          contentPreview={contentPreview}
          onButtonClick={() => onOpen?.(id)}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      </div>
    </div>
  );
}
