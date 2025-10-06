import { render, screen, fireEvent } from '@testing-library/react';
import { Subscribe } from '../../pages/Subscribe.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Subscribe Component', () => {
  it('affiche le formulaire d\'inscription avec les champs requis', () => {
    render(
      <MemoryRouter>
        <Subscribe />
      </MemoryRouter>
    );
    
    // Vérifie que les champs du formulaire sont présents
    expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Prenom')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmez le mot de passe')).toBeInTheDocument();
    
    // Vérifie que les boutons sont présents
    expect(screen.getByText(/s'inscrire/i)).toBeInTheDocument();
    expect(screen.getByText(/retour au login/i)).toBeInTheDocument();
  });

  it('valide que le bouton s\'inscrire est désactivé par défaut', () => {
    render(
      <MemoryRouter>
        <Subscribe />
      </MemoryRouter>
    );
    
    // Vérifie que le bouton est désactivé au départ
    expect(screen.getByText(/s'inscrire/i).closest('button')).toBeDisabled();
  });

  it('affiche une erreur quand les mots de passe ne correspondent pas', () => {
    render(
      <MemoryRouter>
        <Subscribe />
      </MemoryRouter>
    );
    
    // Remplit les champs requis
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Prenom'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez le mot de passe'), { 
      target: { value: 'different' } 
    });
    
    // Vérifie que le message d'erreur s'affiche
    expect(
      screen.getByText(/les mots de passe ne correspondent pas/i)
    ).toBeInTheDocument();
    
    // Le bouton devrait toujours être désactivé
    expect(screen.getByText(/s'inscrire/i).closest('button')).toBeDisabled();
  });

  it('active le bouton s\'inscrire quand tous les champs sont valides', () => {
    render(
      <MemoryRouter>
        <Subscribe />
      </MemoryRouter>
    );
    
    // Remplit tous les champs correctement
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Prenom'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez le mot de passe'), { target: { value: 'password123' }
    });
    
    // Le bouton devrait être activé
    expect(screen.getByText(/s'inscrire/i).closest('button')).not.toBeDisabled();
  });
});
