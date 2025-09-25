import { useState, useRef, useEffect } from 'react';

export const Note = () => {
    const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
    const [isResizing, setIsResizing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
    const noteRef = useRef(null);

    const gridStyle = {
        backgroundImage: `
            linear-gradient(to bottom, grey 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        backgroundColor: 'oklch(87.9% 0.169 91.605)',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        position: 'relative',
        overflow: 'hidden'
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
        setStartPos({
            x: e.clientX,
            y: e.clientY
        });
        setStartDimensions({
            width: dimensions.width,
            height: dimensions.height
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            
            setDimensions({
                width: Math.max(200, startDimensions.width + dx),
                height: Math.max(200, startDimensions.height + dy)
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, startPos, startDimensions]);

    return (
        <div
            ref={noteRef}
            className="rounded-lg fixed top-25 right-10 mb-40 relative"
            style={gridStyle}
        >
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                onMouseDown={handleMouseDown}
            />
        </div>
    );
};