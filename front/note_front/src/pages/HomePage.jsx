import { useState, useEffect } from "react";
import { NoteOnBoard } from "../components/NoteOnBoard.jsx";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { NoteVue } from "../components/NoteVue.jsx";
import { useNotes } from "../hook/useNote";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
	const navigate = useNavigate();


	//componant d'un élément dragable, utilisant des position en x,y
	function DraggableNote({ id, title, contentPreview, position }) {
    	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    	// Wrapper pour la position et le scale
    	const outerStyle = {
    		position: "absolute",
    		left: position.x,
    		top: position.y,
    		transform: transform
    			? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.1 : 1})`
    			: isDragging
    			? "scale(1.1)"
    			: undefined,
    		transition: isDragging ? "none" : "transform 0.3s ease",
    		zIndex: isDragging ? 100 : "auto",
    	};

    	// Inner div pour l'effet de rotation
    	const innerStyle = {
    		boxShadow: isDragging
    			? "0 10px 30px rgba(0,0,0,0.3)"
    			: "0 5px 10px rgba(0,0,0,0.1)",
    		display: "inline-block",
    		transition: isDragging ? "none" : "transform 0.3s ease",
    		animation: isDragging ? "wiggle-rotate 1s infinite" : "none",
    	};

    	return (
    		<div ref={setNodeRef} style={outerStyle} {...attributes} {...listeners}>
    			<div style={innerStyle}>
    				<NoteOnBoard
    					title={title}
    					contentPreview={contentPreview}
    					onButtonClick={() => onClickNoteHandler(id)}
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
			//ajout des notes récupérer dans une fonction
			const apiNotes = resp.data;

			// création d'un élément pour chaque note avec position alléatoire en fonction de la taille de l'écran
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

		// application du fond en liège; todo -> le faire proprement
		document.body.style.backgroundImage = "url('/tableau-liege.jpg')";
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundPosition = "center";

		return () => {
			//nétoyage quand on quitte la page
			document.body.style.backgroundImage = "";
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
			<button className="creat-note-btn note-btn" onClick={onClickCreateNote}>
				Crée une note
			</button>
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
