import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../../components/Navbar.jsx";
import { useAuth } from "../../hook/useAuth";
import '@testing-library/jest-dom';

// Mock du hook useAuth
jest.mock("../../hook/useAuth");

describe("Navbar", () => {
  const logoutMock = jest.fn();
  const isAuthenticatedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      isAuthenticated: isAuthenticatedMock,
      logout: logoutMock,
    });
  });

  test("renders Navbar without crashing", () => {
    isAuthenticatedMock.mockReturnValue(false);

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );


    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });

  test("displays Déconnexion button when authenticated", () => {
    isAuthenticatedMock.mockReturnValue(true);

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("calls logout and navigates on Déconnexion with confirm", () => {
    isAuthenticatedMock.mockReturnValue(true);

    // Mock de window.confirm pour renvoyer true
    window.confirm = jest.fn(() => true);

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Déconnexion"));

    expect(window.confirm).toHaveBeenCalledWith("Êtes-vous sûr de vouloir vous déconnecter ?");
    expect(logoutMock).toHaveBeenCalled();
  });

  test("does not logout if confirmation is cancelled", () => {
    isAuthenticatedMock.mockReturnValue(true);

    // Mock de window.confirm pour renvoyer false
    window.confirm = jest.fn(() => false);

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Déconnexion"));

    expect(window.confirm).toHaveBeenCalled();
    expect(logoutMock).not.toHaveBeenCalled();
  });

  test("toggles menu open/close when nav button clicked", () => {
    isAuthenticatedMock.mockReturnValue(false);

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByText("Ouvrir le menu");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Fermer le menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Fermer le menu"));
    expect(screen.getByText("Ouvrir le menu")).toBeInTheDocument();
  });
});
