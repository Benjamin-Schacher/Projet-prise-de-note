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

    const { getNotes,
            notes,
            error,
            createNotes,
            loading,
            getByUserId,
            getById,
            getPaginate,
            updateNotes } = useNotes();
    const [tableNotes, setTableNotes] = useState([]);
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
      getByUserId(idUser).then((resp) => {
        const apiNotes = resp.data;

        const tableNotes = apiNotes.map((note) => {
          const width = window.innerWidth;
          const height = window.innerHeight;

          return {
            id: note.id.toString(),
            title: note.title,
            content: note.content,
            contentPreview: note.content.substring(0, 50),
            creationDate: new Date(note.date).toISOString().split("T")[0],
            position: {
              x: Math.floor(Math.random() * (width - 2 * 200)) + 200,
              y: Math.floor(Math.random() * (height - 2 * 200)) + 200,
            },
          };
        });

        setTableNotes(tableNotes);
      });
    }


    useEffect(() => {
       const fetchNotes = async () => {
            const idUser = sessionStorage.getItem("id_user");
            if (idUser) {
                await getAllNotes(idUser);
            } else {
                navigate("/connexion");
            }
       };

       fetchNotes();

       document.body.style.backgroundImage = "url('/tableau-liege.jpg')";
       document.body.style.backgroundSize = "cover";
       document.body.style.backgroundPosition = "center";

       return () => {
         document.body.style.backgroundImage = "";
       };
    }, [navigate]);



   const updatePosition = (id, newPos) => {
     setTableNotes((prev) =>
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
                  note_id={selectedNote.id}
                  title={selectedNote.title}
                  creationDate={selectedNote.creationDate}
                  content={selectedNote.content}
                  onClose={closeNoteModal}
                  onUpdate={(updatedNote) => {
                      setTableNotes((prev) =>
                        prev.map((note) =>
                          note.id === updatedNote.id
                            ? {
                                ...note,
                                ...updatedNote,
                                contentPreview: updatedNote.content.substring(0, 50),
                              }
                            : note
                        )
                      );
                    }}

                />
            )}
        </>
   );
};