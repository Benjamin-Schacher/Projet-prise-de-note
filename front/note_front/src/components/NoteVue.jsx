import { useState } from "react";
import { useNotes } from "../hook/useNote";

export function NoteVue({ note_id, title, creationDate, content, onClose, onUpdate, onDeleteNote }) {
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(title);
	const [newContent, setNewContent] = useState(content);
	const { getNotes,
		notes,
		error,
		updateNotes } = useNotes();
	const [errors, setErrors] = useState({ title: "", content: "" });


	//requete pour modifier la note -> todo : la sortir pour la gérer dans le composant parent
	const handleSubmit = async (e) => {
		e.preventDefault();

		//gestion d'érreur si titre ou contenue invalide
		let valid = true;
		const newErrors = { title: "", content: "" };
		if (!newTitle.trim()) {
			newErrors.title = "Le titre ne peut pas être vide";
			valid = false;
		}
		if (!newContent.trim()) {
			newErrors.content = "Le contenu ne peut pas être vide";
			valid = false;
		}
		setErrors(newErrors);
		if (!valid) return;

		//envoi de la requete et gestion de la réponse
		try {
			//update partielle avec l'id, le nouveau titre et le nouveau contenu
			const response = await updateNotes({ id: note_id, title: newTitle, content: newContent });

			// si réponse valide on change les valeur afficher sinon une erreur
			if (response.status !== 200) {
				throw new Error("Erreur lors de l'envoi");
			} else {
				setNewTitle(newTitle);
				setNewContent(newContent);
			}

			//Remonter au parent les modification sur une update
			onUpdate?.({
				id: note_id,
				title: newTitle,
				content: newContent,
			});

			//affichage de la note
			setIsEditing(false);
		} catch (error) {
			console.error(error);
			alert("Impossible d'envoyer les modifications");
		}
	};

	return (
		<div className="popup-vue-note">
			<div className="note-vue-header">
				<div className="note-vue-header-first-chield">
					<p>{creationDate}</p>
					{!isEditing ? (
						<p className="note-vue-title">{newTitle}</p>
					) : (
						<input
							className={`note-vue-title editable ${errors.title ? "error-field" : ""}`}
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
						/>
					)}
					{errors.title && <p className="error-message">{errors.title}</p>}
				</div>

				<div>
					<button
						className="btn note-vue-btn"
						onClick={() => {
							if (isEditing) {
								setIsEditing(false);
								setErrors({ title: "", content: "" });
								setNewTitle(title);
								setNewContent(content);
							} else {
								setIsEditing(true);
							}
						}}
					>
						{isEditing ? "Annuler" : "Modifier"}
					</button>

					{!isEditing && (
						<button
							className="btn note-vue-btn"
							onClick={() => {
								onDeleteNote?.(note_id);
							}}
						>
							Supprimer
						</button>
					)}
				</div>
			</div>

			{!isEditing ? (
				<p className="note-vue-content">{newContent}</p>
			) : (
				<>
					<textarea
						className={`note-vue-content editable ${errors.content ? "error-field" : ""}`}
						value={newContent}
						onChange={(e) => setNewContent(e.target.value)}
					/>
					{errors.content && <p className="error-message">{errors.content}</p>}
				</>
			)}

			{isEditing ? (
				<button className="btn note-vue-btn" onClick={handleSubmit}>
					Envoyer
				</button>
			) : (
				<button className="btn note-vue-btn" onClick={onClose}>
					Fermer
				</button>
			)}
		</div>
	);
}
