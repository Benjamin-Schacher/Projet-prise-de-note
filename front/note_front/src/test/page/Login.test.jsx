import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from '../../pages/Login.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Login Component', () => {
  it('affiche le formulaire de connexion avec les champs requis', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // Vérifie que les champs du formulaire sont présents
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    
    // Vérifie que les boutons sont présents
    expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
    expect(screen.getByText(/s'inscrire/i)).toBeInTheDocument();
  });

  it('affiche un message d\'erreur quand le mot de passe est trop court', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // Simule la saisie d'un mot de passe trop court
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    // Vérifie que le message d'erreur s'affiche
    expect(
      screen.getByText(/le mot de passe doit contenir au moins 5 caractères/i)
    ).toBeInTheDocument();
  });

  it('valide le format de l\'email', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // Récupère le champ email
    const emailInput = screen.getByPlaceholderText(/email/i);
    
    // Simule une saisie d'email invalide
    fireEvent.change(emailInput, { target: { value: 'email-invalide' } });
    
    // Le bouton devrait être désactivé car l'email est invalide
    expect(screen.getByText(/se connecter/i).closest('button')).toBeDisabled();
    
    // Corrige l'email
    fireEvent.change(emailInput, { target: { value: 'email@valide.com' } });
    
    // Le bouton devrait toujours être désactivé car le mot de passe est manquant
    expect(screen.getByText(/se connecter/i).closest('button')).toBeDisabled();
  });

  it('active le bouton de connexion uniquement quand les champs sont valides', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByText(/se connecter/i).closest('button');
    
    // Vérifie que le bouton est désactivé au départ
    expect(submitButton).toBeDisabled();
    
    // Remplit uniquement l'email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(submitButton).toBeDisabled();
    
    // Remplit un mot de passe valide
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Maintenant que les deux champs sont valides, le bouton devrait être activé
    expect(submitButton).not.toBeDisabled();
  });
});

