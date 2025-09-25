import { useState, useEffect } from "react";
import {NoteOnBoard} from "../components/NoteOnBoard.jsx";
import { DndContext, useDraggable } from "@dnd-kit/core";


export const HomePage = () => {

    function DraggableNote({ id, title, contentPreview, position, setPosition }) {
      const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

      const style = {
        position: "absolute",
        left: position?.x || 0,
        top: position?.y || 0,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      };

      return (
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          onPointerUp={() => {
            if (transform) {
              setPosition({ x: position.x + transform.x, y: position.y + transform.y });
            }
          }}
        >
          <NoteOnBoard title={title} contentPreview={contentPreview} />
        </div>
      );
    }




    const testNotes = [
        { id: "1", title: "Note 1", contentPreview: "test 1" ,position: { x: 50, y: 50 } },
        { id: "2", title: "Note 2", contentPreview: "test 2", position: { x: 50, y: 50 } },
    ];
    const [notes, setNotes] = useState(testNotes);
    const [user_id, setUser_id] = useState();



     async function getAllNotes() {
        try {
          const response = await fetch(`https://xxx?user_id=${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error("Erreur lors de la récupération");

          const data = await response.json();
          setNotes(data);
        } catch (error) {
          console.error(error);
          alert("Impossible de récupérer les notes");
        }
      }

      useEffect(() => {
        // getAllNotes();
        document.body.style.backgroundImage = "url('/tableau-liege.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
          document.body.style.backgroundImage = "";
        };
      }, []);

    const updatePosition = (id, newPos) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, position: newPos } : note))
      );
    };

    return (
        <DndContext>
          <div>
            {notes.map((note) => (
              <DraggableNote
                key={note.id}
                id={note.id}
                title={note.title}
                contentPreview={note.contentPreview}
                position={note.position}
                setPosition={(pos) => updatePosition(note.id, pos)}
              />
            ))}
          </div>
        </DndContext>
    );
};