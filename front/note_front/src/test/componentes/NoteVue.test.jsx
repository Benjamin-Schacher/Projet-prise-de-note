import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteVue } from '../../components/NoteVue.jsx';
import '@testing-library/jest-dom';

// Mock du hook useNotes
jest.mock('../../hook/useNote', () => ({
	useNotes: () => ({
		getNotes: jest.fn(),
		notes: [],
		error: null,
		updateNotes: jest.fn(() => Promise.resolve({ status: 200 })),
	}),
}));

describe('NoteVue', () => {
	const defaultProps = {
		note_id: 1,
		title: 'Titre Test',
		creationDate: '2025-10-06',
		content: 'Contenu Test',
		onClose: jest.fn(),
		onUpdate: jest.fn(),
		onDeleteNote: jest.fn(),
	};

	test('renders NoteVue without crashing', () => {
		render(<NoteVue {...defaultProps} />);

		// Vérifie que le titre et le contenu sont affichés
		expect(screen.getByText('Titre Test')).toBeInTheDocument();
		expect(screen.getByText('Contenu Test')).toBeInTheDocument();
		expect(screen.getByText('2025-10-06')).toBeInTheDocument();
	});

	test('edit mode opens and closes correctly', () => {
		render(<NoteVue {...defaultProps} />);

		const modifyButton = screen.getByText('Modifier');
		fireEvent.click(modifyButton);

		// Vérifie que l'input apparaît
		expect(screen.getByDisplayValue('Titre Test')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Contenu Test')).toBeInTheDocument();

		// Annuler la modification
		const cancelButton = screen.getByText('Annuler');
		fireEvent.click(cancelButton);

		// L'input disparaît, le texte original réapparaît
		expect(screen.getByText('Titre Test')).toBeInTheDocument();
		expect(screen.getByText('Contenu Test')).toBeInTheDocument();
	});

	test('calls onClose when Fermer button is clicked', () => {
		render(<NoteVue {...defaultProps} />);

		const closeButton = screen.getByText('Fermer');
		fireEvent.click(closeButton);

		expect(defaultProps.onClose).toHaveBeenCalled();
	});

	test('calls onDeleteNote when Supprimer button is clicked', () => {
		render(<NoteVue {...defaultProps} />);

		const deleteButton = screen.getByText('Supprimer');
		fireEvent.click(deleteButton);

		expect(defaultProps.onDeleteNote).toHaveBeenCalledWith(1);
	});

	test('calls onUpdate when Envoyer button is clicked in edit mode', async () => {
		render(<NoteVue {...defaultProps} />);
		fireEvent.click(screen.getByText('Modifier')); // passe en mode édition

		fireEvent.click(screen.getByText('Envoyer'));

		await waitFor(() => {
			expect(defaultProps.onUpdate).toHaveBeenCalledWith({
				id: 1,
				title: 'Titre Test',
				content: 'Contenu Test',
			});
		});
	});
});
