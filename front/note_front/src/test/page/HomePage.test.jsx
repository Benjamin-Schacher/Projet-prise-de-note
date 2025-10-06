import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HomePage } from "../../pages/HomePage";
import { useNotes } from "../../hook/useNote";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Mock du hook useNotes
jest.mock("../../hook/useNote");

// Mock complet de useInstanceAxios
jest.mock('../../hook/useInstanceAxios', () => ({
	useInstanceAxios: () => ({
		get: jest.fn(() => Promise.resolve({ data: [] })),
		post: jest.fn(() => Promise.resolve({ data: {} })),
		patch: jest.fn(() => Promise.resolve({ status: 200 })),
		delete: jest.fn(() => Promise.resolve({ status: 200 })),
	}),
}));

const mockNotes = [
	{
		id: "1",
		title: "Note 1",
		content: "Contenu de la note 1",
		date: "2025-10-06T10:00:00.000Z",
		position: { x: 100, y: 100 },
	},
	{
		id: "2",
		title: "Note 2",
		content: "Contenu de la note 2",
		date: "2025-10-06T11:00:00.000Z",
		position: { x: 200, y: 200 },
	},
];

describe("HomePage", () => {
	const createMock = jest.fn(() => Promise.resolve({
    	id: "3",
    	data: { ...mockNotes[0], id: "3", title: "Note 3" }
    }));
	const deleteMock = jest.fn(() => Promise.resolve({ status: 200 }));
	const getByUserIdMock = jest.fn(() =>
		Promise.resolve({ data: mockNotes })
	);

	beforeEach(() => {
		useNotes.mockReturnValue({
			notes: [],
			getNotes: jest.fn(),
			createNotes: createMock,
			deleteNote: deleteMock,
			getByUserId: getByUserIdMock,
			getById: jest.fn(),
			updateNotes: jest.fn(),
			getPaginate: jest.fn(),
			loading: false,
			error: null,
		});
		sessionStorage.setItem("id_user", "1");
	});

	afterEach(() => {
		jest.clearAllMocks();
		sessionStorage.clear();
	});

	test("renders notes after fetching", async () => {
		render(
			<BrowserRouter>
				<HomePage />
			</BrowserRouter>
		);

		await waitFor(() => {
			expect(getByUserIdMock).toHaveBeenCalledWith("1");
		});

		// Vérifie que les titres des notes sont affichés
		expect(screen.getByText("Note 1")).toBeInTheDocument();
		expect(screen.getByText("Note 2")).toBeInTheDocument();
	});

	test("can create a new note", async () => {
		render(
			<BrowserRouter>
				<HomePage />
			</BrowserRouter>
		);

		const createButton = screen.getByText("Crée une note");
		fireEvent.click(createButton);

		await waitFor(() => {
			expect(createMock).toHaveBeenCalled();
		});

		// Vérifie que la note créée s'affiche
		expect(screen.getByText("Note 1")).toBeInTheDocument();
	});

	test("can open and close NoteVue modal", async () => {
		render(
			<BrowserRouter>
				<HomePage />
			</BrowserRouter>
		);

		await waitFor(() => {
			expect(getByUserIdMock).toHaveBeenCalled();
		});

		// Clique sur le bouton "Voir" de la première note
		const voirButtons = screen.getAllByText("Voir");
		fireEvent.click(voirButtons[0]);

		// La modale NoteVue doit apparaître
		expect(screen.getByText("Contenu de la note 1")).toBeInTheDocument();

		// Clique sur "Fermer"
		const fermerButton = screen.getByText("Fermer");
		fireEvent.click(fermerButton);

		await waitFor(() => {
			expect(screen.queryByText("Contenu de la note 1")).not.toBeInTheDocument();
		});
	});

	test("can delete a note", async () => {
		render(
			<BrowserRouter>
				<HomePage />
			</BrowserRouter>
		);

		await waitFor(() => {
			expect(getByUserIdMock).toHaveBeenCalled();
		});

		// Ouvre la modale de la première note
		const voirButtons = screen.getAllByText("Voir");
		fireEvent.click(voirButtons[0]);

		// Clique sur "Supprimer"
		const supprimerButton = screen.getByText("Supprimer");
		fireEvent.click(supprimerButton);

		await waitFor(() => {
			expect(deleteMock).toHaveBeenCalledWith("1");
		});
	});
});
