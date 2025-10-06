import { render, screen, fireEvent } from '@testing-library/react';
import { NoteOnBoard } from '../../components/NoteOnBoard.jsx';
import '@testing-library/jest-dom';

describe('NoteOnBoard', () => {
	const defaultProps = {
		title: 'Titre Test',
		contentPreview: 'Aperçu du contenu',
		onButtonClick: jest.fn(),
		dragHandleProps: { 'data-testid': 'drag-handle' },
	};

	test('renders NoteOnBoard with title and contentPreview', () => {
		render(<NoteOnBoard {...defaultProps} />);

		expect(screen.getByText('Titre Test')).toBeInTheDocument();
		expect(screen.getByText('Aperçu du contenu...')).toBeInTheDocument();
		expect(screen.getByText('Voir')).toBeInTheDocument();
	});

	test('calls onButtonClick when "Voir" button is clicked', () => {
		render(<NoteOnBoard {...defaultProps} />);
		const button = screen.getByText('Voir');

		fireEvent.click(button);

		expect(defaultProps.onButtonClick).toHaveBeenCalled();
	});

	test('applies dragHandleProps to title and contentPreview', () => {
		render(<NoteOnBoard {...defaultProps} />);

		const title = screen.getByText('Titre Test');
		const contentPreview = screen.getByText('Aperçu du contenu...');

		expect(title).toHaveAttribute('data-testid', 'drag-handle');
		expect(contentPreview).toHaveAttribute('data-testid', 'drag-handle');
	});
});
