import { useState, useEffect } from "react";
import { NoteOnBoard } from "../components/NoteOnBoard.jsx";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { NoteVue } from "../components/NoteVue.jsx";
import { useNotes } from "../hook/useNote";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
	const navigate = useNavigate();
    const [maxZIndex, setMaxZIndex] = useState(10);


	//componant d'un élément dragable, utilisant des position en x,y
	function DraggableNote({ id, title, contentPreview, position, zIndex }) {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

        const outerStyle = {
            position: "absolute",
            left: position.x,
            top: position.y,
            transform: transform
                ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.1 : 1})`
                : isDragging
                ? "scale(1.1)"
                : undefined,
            transition: isDragging ? "none" : "left 0.3s ease, top 0.3s ease, transform 0.3s ease",
            zIndex: zIndex, // <-- appliquer le zIndex
        };

        const innerStyle = {
            boxShadow: isDragging
                ? "0 10px 30px rgba(0,0,0,0.3)"
                : "0 5px 10px rgba(0,0,0,0.1)",
            display: "inline-block",
            transition: isDragging ? "none" : "transform 0.3s ease, box-shadow 0.3s ease",
            animation: isDragging ? "wiggle-rotate 1s infinite" : "none",
        };

        return (
            <div ref={setNodeRef} style={outerStyle}>
                <div style={innerStyle}>
                    <NoteOnBoard
                        title={title}
                        contentPreview={contentPreview}
                        onButtonClick={() => onClickNoteHandler(id)}
                        dragHandleProps={{ ...listeners, ...attributes }}
                    />
                </div>
            </div>
        );
    }

	const {
		getNotes,
		notes,
		error,
		createNotes,
		loading,
		getByUserId,
		getById,
		deleteNote,
		getPaginate,
		updateNotes,
	} = useNotes();

	const [tableNotes, setTableNotes] = useState([]);
	const [user_id, setUser_id] = useState();
	const [selectedNote, setSelectedNote] = useState(null);
	const [newNoteTitle, setNewNoteTitle] = useState("titre");
	const [newNoteContent, setNewNoteContent] = useState("contenue");

	// Ecouteur d'évenement de début de drague pour augmenter le zindex
    const handleDragStart = (event) => {
        const { active } = event;
        // Incrémente le zIndex max
        setTableNotes(prev =>
            prev.map(note =>
                note.id === active.id
                    ? { ...note, zIndex: maxZIndex + 1 }
                    : note
            )
        );
        setMaxZIndex(prev => prev + 1);
    };
	// Ecouteur d'évenement de lacher d'un élément dragable, mise a jour de la posion x, y de la note
	const handleDragEnd = (event) => {
		const { active, delta } = event;
		const id = active.id;
		setTableNotes((prev) =>
			prev.map((note) =>
				note.id === id
					? {
							...note,
							position: {
								x: note.position.x + delta.x,
								y: note.position.y + delta.y,
							},
					  }
					: note
			)
		);
	};

	// Fonction pour fermet la modale de la vue d'une note
	function closeNoteModal() {
		setSelectedNote(null);
	}

	// Fonction pour afficher les détaille de la note au click du bouton du component
	function onClickNoteHandler(noteId) {
		const note = tableNotes.find((n) => n.id === noteId);
		if (note) {
			setSelectedNote(note);
		}
	}

	// Récupérer tout les notes du user connecter avec son id
	function getAllNotes(idUser) {
        getByUserId(idUser).then((resp) => {
            const apiNotes = resp.data.content; // <-- c'est ici que sont tes notes
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


	// Au début de vie de la page, vérifier si utilisateur connecter et récupérer son id ou le rediriger vers la page de connection
	useEffect(() => {
		const fetchNotes = async () => {
            //sessionStorage.setItem("id_user", 1); pour les test
			const idUser = sessionStorage.getItem("id_user");
			if (idUser) {
				await getAllNotes(idUser);
			} else {
				navigate("/connexion");
			}
		};

		// appel de la fonction pour récupérer les notes de l'utilisateur
		fetchNotes();

		return () => {
		};
	}, [navigate]);

	// metre a jour la position des post-it
	const updatePosition = (id, newPos) => {
		setTableNotes((prev) =>
			prev.map((note) => (note.id === id ? { ...note, position: newPos } : note))
		);
	};

	// handler pour la suppréssion de la note avec gestion d'érreur
	const handleDeleteNote = async (noteId) => {
		try {
			await deleteNote(noteId);
			setTableNotes((prev) => prev.filter((note) => note.id !== noteId));
			setSelectedNote(null);
		} catch (err) {
			console.error("Erreur lors de la suppression :", err);
			alert("Impossible de supprimer la note");
		}
	};

    // Fonction pour trier et aligner les notes en grille
    const handleSortNotes = () => {
        const noteWidth = 200;
        const noteHeight = 200;
        const margin = 20;
        const maxColumns = Math.floor(window.innerWidth / (noteWidth + margin));
        const gridWidth = maxColumns * (noteWidth + margin) - margin;
        const startX = (window.innerWidth - gridWidth) / 2;
        const startY = 100;

        const sortedNotes = tableNotes.map((note, index) => {
            const row = Math.floor(index / maxColumns);
            const col = index % maxColumns;
            const newX = startX + col * (noteWidth + margin);
            const newY = startY + row * (noteHeight + margin);

            return {
                ...note,
                position: { x: newX, y: newY },
                zIndex: 10,
            };
        });

        setTableNotes(sortedNotes);
        setMaxZIndex(10);
    };

	// gestion de la création d'une note avec requete a l'api et mise a jour du "dachboard"
	const onClickCreateNote = async () => {
		//récupérer les dimention de l'écran
		const width = window.innerWidth;
		const height = window.innerHeight;

		//récupérer l'id de l'utilisateur
		const userId = sessionStorage.getItem("id_user");

		// crée un nouvelle object note
		const newNoteData = {
			title: newNoteTitle,
			content: newNoteContent,
			date: new Date().toISOString(),
			user: { id: userId },
		};

		// l'envoyer au back
		try {
			const response = await createNotes(newNoteData);
			const createdNote = response.data;

			//crée une note sur le dashboard coter front
			const noteForFront = {
				id: createdNote.id.toString(),
				title: createdNote.title,
				content: createdNote.content,
				contentPreview: createdNote.content.substring(0, 50),
				creationDate: new Date(createdNote.date).toISOString().split("T")[0],
				position: {
					x: Math.floor(Math.random() * (width - 2 * 200)) + 200,
					y: Math.floor(Math.random() * (height - 2 * 200)) + 200,
				},
			};
			setTableNotes((prev) => [...prev, noteForFront]);

			// l'afficher en détaille
			setSelectedNote(noteForFront);
		} catch (err) {
			console.error("Erreur lors de la création de la note :", err);
		}
	};

	return (
		<>
		    <div className="background-note"></div>
		    <div className="note-action">
                <button className="creat-note-btn note-btn" onClick={onClickCreateNote}>
                    Crée une note
                </button>
                <button className="creat-note-btn note-btn" onClick={handleSortNotes}>
                    Trié les notes
                </button>
			</div>
			<DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                <div>
                    {tableNotes.map((note) => (
                        <DraggableNote
                            key={note.id}
                            id={note.id}
                            title={note.title}
                            contentPreview={note.contentPreview}
                            position={note.position}
                            zIndex={note.zIndex || 10}
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
					onDeleteNote={handleDeleteNote}
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
