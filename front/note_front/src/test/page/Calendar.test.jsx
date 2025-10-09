import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import { Calendar } from "../../pages/Calendar";
import { useEvents } from "../../hook/useEvents";
import { useAuth } from "../../hook/useAuth";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock du hook useEvents
jest.mock("../../hook/useEvents");

// Mock du hook useAuth
jest.mock("../../hook/useAuth");

// Mock de react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock complet de useInstanceAxios
jest.mock("../../hook/useInstanceAxios", () => ({
  useInstanceAxios: () => ({
    get: jest.fn().mockResolvedValue({
      data: {
        content: [
          {
            id: "1",
            title: "Réunion",
            content: "Réunion d'équipe hebdomadaire",
            startDate: "2025-10-09T10:00:00.000Z",
            endDate: "2025-10-09T11:00:00.000Z",
            user: { id: "1" },
          },
          {
            id: "2",
            title: "Déjeuner",
            content: "Déjeuner avec client",
            startDate: "2025-10-09T12:00:00.000Z",
            endDate: "2025-10-09T13:00:00.000Z",
            user: { id: "1" },
          },
        ],
      },
    }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ status: 200 }),
    delete: jest.fn().mockResolvedValue({ status: 200 }),
  }),
}));

describe("Calendar", () => {
  const createEventMock = jest.fn().mockResolvedValue({ data: {} });
  const updateEventMock = jest.fn().mockResolvedValue({ status: 200 });
  const getByUserIdMock = jest.fn().mockResolvedValue({
    data: {
      content: [
        {
          id: "1",
          title: "Réunion",
          content: "Réunion d'équipe hebdomadaire",
          startDate: "2025-10-09T10:00:00.000Z",
          endDate: "2025-10-09T11:00:00.000Z",
          user: { id: "1" },
        },
        {
          id: "2",
          title: "Déjeuner",
          content: "Déjeuner avec client",
          startDate: "2025-10-09T12:00:00.000Z",
          endDate: "2025-10-09T13:00:00.000Z",
          user: { id: "1" },
        },
      ],
    },
  });

  beforeEach(() => {
    // Mock useAuth
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn(() => true),
    });

    // Mock useEvents
    useEvents.mockReturnValue({
      getByUserId: getByUserIdMock,
      createEvent: createEventMock,
      updateEvent: updateEventMock,
      loading: false,
      error: null,
    });

    // Mock useNavigate
    jest.mocked(require("react-router-dom").useNavigate).mockReturnValue(jest.fn());

    // Simuler un utilisateur connecté
    sessionStorage.setItem("id_user", "1");

    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("renders calendar and fetches events", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Calendar />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(getByUserIdMock).toHaveBeenCalled();
    }, { timeout: 15000 });

    expect(screen.getByText("Mon Calendrier")).toBeInTheDocument();
  });

  test("redirects to login if not authenticated", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn(() => false),
    });

    const navigateMock = jest.fn();
    jest.mocked(require("react-router-dom").useNavigate).mockReturnValue(navigateMock);

    await act(async () => {
      render(
        <BrowserRouter>
          <Calendar />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/connexion");
    }, { timeout: 15000 });
  });

  test("can create a new event", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Calendar />
        </BrowserRouter>
      );
    });

    await act(async () => {
      const titleInput = document.querySelector('input[name="title"]');
      const contentInput = document.querySelector('textarea[name="content"]');
      const startDateInput = document.querySelector('input[name="startDate"]');
      const endDateInput = document.querySelector('input[name="endDate"]');

      fireEvent.change(titleInput, { target: { value: "Nouvel événement" } });
      fireEvent.change(contentInput, { target: { value: "Description du nouvel événement" } });
      fireEvent.change(startDateInput, { target: { value: "2025-10-10T14:00" } });
      fireEvent.change(endDateInput, { target: { value: "2025-10-10T15:00" } });

      fireEvent.click(screen.getByRole("button", { name: /Ajouter l'événement/i }));
    });

    await waitFor(() => {
      expect(createEventMock).toHaveBeenCalledWith({
        title: "Nouvel événement",
        content: "Description du nouvel événement",
        startDate: expect.any(String),
        endDate: expect.any(String),
        user: { id: "1" },
      });
      expect(getByUserIdMock).toHaveBeenCalled();
    }, { timeout: 15000 });
  });

  test("can select and edit an event", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Calendar />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(getByUserIdMock).toHaveBeenCalled();
    }, { timeout: 15000 });

    await act(async () => {
      const eventElement = screen.getByText("Réunion");
      fireEvent.click(eventElement);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    await act(async () => {
      const titleInput = document.querySelector('input[name="title"]');
      const contentInput = document.querySelector('textarea[name="content"]');
      const startDateInput = document.querySelector('input[name="startDate"]');
      const endDateInput = document.querySelector('input[name="endDate"]');

      fireEvent.change(titleInput, { target: { value: "Réunion modifiée" } });
      fireEvent.change(contentInput, { target: { value: "Réunion d'équipe hebdomadaire" } });
      fireEvent.change(startDateInput, { target: { value: "2025-10-09T10:00" } });
      fireEvent.change(endDateInput, { target: { value: "2025-10-09T11:00" } });

      fireEvent.click(screen.getByRole("button", { name: /Modifier l'événement/i }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    await waitFor(() => {
      console.log("createEventMock calls:", createEventMock.mock.calls);
      console.log("updateEventMock calls:", updateEventMock.mock.calls);
      expect(updateEventMock).toHaveBeenCalledWith({
        id: expect.any(String),
        title: "Réunion modifiée",
        content: "Réunion d'équipe hebdomadaire",
        startDate: expect.any(String),
        endDate: expect.any(String),
        user: { id: "1" },
      });
      expect(getByUserIdMock).toHaveBeenCalled();
    }, { timeout: 15000 });
  });

  test("can cancel event editing", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Calendar />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(getByUserIdMock).toHaveBeenCalled();
    }, { timeout: 15000 });

    await act(async () => {
      const eventElement = screen.getByText("Réunion");
      fireEvent.click(eventElement);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    await act(async () => {
      const titleInput = document.querySelector('input[name="title"]');
      const contentInput = document.querySelector('textarea[name="content"]');
      const startDateInput = document.querySelector('input[name="startDate"]');
      const endDateInput = document.querySelector('input[name="endDate"]');

      fireEvent.change(titleInput, { target: { value: "Réunion modifiée" } });
      fireEvent.change(contentInput, { target: { value: "Réunion d'équipe hebdomadaire" } });
      fireEvent.change(startDateInput, { target: { value: "2025-10-09T10:00" } });
      fireEvent.change(endDateInput, { target: { value: "2025-10-09T11:00" } });

      fireEvent.click(screen.getByRole("button", { name: /Annuler/i }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    await waitFor(() => {
      const titleInput = document.querySelector('input[name="title"]');
      const contentInput = document.querySelector('textarea[name="content"]');
      const startDateInput = document.querySelector('input[name="startDate"]');
      const endDateInput = document.querySelector('input[name="endDate"]');

      expect(titleInput).toHaveValue("");
      expect(contentInput).toHaveValue("");
      expect(startDateInput).toHaveValue("");
      expect(endDateInput).toHaveValue("");
      expect(updateEventMock).not.toHaveBeenCalled();
      expect(createEventMock).not.toHaveBeenCalled();
    }, { timeout: 15000 });
  });
});