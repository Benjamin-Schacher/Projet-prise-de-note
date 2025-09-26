import { useState, useEffect } from "react";
import {NoteOnBoard} from "../components/NoteOnBoard.jsx";
import { DndContext, useDraggable } from "@dnd-kit/core";
import {NoteVue} from "../components/NoteVue.jsx";
import { useNotes } from "../hook/useNote";
import { useNavigate } from "react-router-dom";


export const HomePage = () => {
    const navigate = useNavigate();

    function DraggableNote({ id, title, contentPreview, position }) {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

        const style = {
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        };

        return (
          <div ref={setNodeRef} style={style}>
            <NoteOnBoard
              title={title}
              contentPreview={contentPreview}
              onButtonClick={() => onClickNoteHandler(id)}
              dragHandleProps={{ ...listeners, ...attributes }}
            />
          </div>
        );
      }

    const testNotes = [
      {
        id: "1",
        title: "Note 1",
        contentPreview: "test 1",
        content: "This is the full content of Note 1.",
        creationDate: "2025-09-25",
        position: { x: 50, y: 50 },
      },
      {
        id: "2",
        title: "Note 2",
        contentPreview: "test 2",
        content: "This is the full content of Note 2.",
        creationDate: "2025-09-25",
        position: { x: 300, y: 50 },
      },
    ];
    const { getNotes,
            notes,
            error,
            createNotes,
            loading,
            getById,
            getPaginate,
            updateNotes } = useNotes();
    const [tableNotes, setTableNotes] = useState(testNotes);
    const [user_id, setUser_id] = useState();
    const [selectedNote, setSelectedNote] = useState(null);

    const handleDragEnd = (event) => {
      const { active, delta } = event;
      const id = active.id;
      setTableNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, position: { x: note.position.x + delta.x, y: note.position.y + delta.y } }
            : note
        )
      );
    };

    function closeNoteModal() {
      setSelectedNote(null);
    }
    function onClickNoteHandler(noteId) {
        console.log("note :"+noteId);
        const note = tableNotes.find((n) => n.id === noteId);
        if (note) {
          setSelectedNote(note);

        }
    }

    function getAllNotes(idUser) {
         getById(idUser).then((resp) => {
            console.log("resp", resp);
            setTableNotes(resp.data);
         });
    }

    useEffect(() => {
       if (sessionStorage.getItem("id_user")) {
           response = getAllNotes(sessionStorage.getItem("id_user"));

       } else {
           //avigate("/connexion");
       }
       document.body.style.backgroundImage = "url('/tableau-liege.jpg')";
       document.body.style.backgroundSize = "cover";
       document.body.style.backgroundPosition = "center";

       return () => {
         document.body.style.backgroundImage = "";
       };
    }, [navigate]);



   const updatePosition = (id, newPos) => {
     setNotes((prev) =>
       prev.map((note) => (note.id === id ? { ...note, position: newPos } : note))
     );
   };

   return (
       <>
            <DndContext onDragEnd={handleDragEnd}>
              <div>
                {tableNotes.map((note) => (
                  <DraggableNote
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    contentPreview={note.contentPreview}
                    position={note.position}
                  />
                ))}
              </div>
            </DndContext>

            {selectedNote && (
                <NoteVue
                  title={selectedNote.title}
                  creationDate={selectedNote.creationDate}
                  content={selectedNote.content}
                  onClose={closeNoteModal}
                />
            )}
        </>
   );
};