import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 5;

/* bouton de connexion */

    const handleSubmit = async (e) => {
        e.preventDefault();
        //si tout est en ordre
        if (!isEmailValid || !isPasswordValid) return;

        //envoi des données au post dédier
        try {
            const response = await fetch('http://localhost:8080/auth/connexion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            // Vérification du type de contenu de la réponse
            const contentType = response.headers.get('content-type');
            let data = {};
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            }

            // Gestion des erreurs
            if (!response.ok) {
                const errorMessage = data.message || 'Erreur lors de la connexion';
                throw new Error(errorMessage);
            }

            // Connexion réussie
            setIsSuccess(true);
            setLoginMessage('Connexion réussie ! Redirection en cours...');
            
            // Stocker le token ou les informations utilisateur si nécessaire
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            // Rediriger vers la page d'accueil après 2 secondes
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setLoginMessage(error.message || 'Erreur lors de la connexion');
            setIsSuccess(false);
        }
    };

/* bouton d'inscription */

    const subscribe = (e) => {
        e.preventDefault();
        navigate('/subscribe');
    };

/* boite de connexion */

    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border pt-6 px-4 pb-4">
            <h2 className="text-black text-lg font-bold mb-4 text-center">Connexion</h2>
            
            {loginMessage && (
                <div className={`mb-4 p-3 rounded ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {loginMessage}
                </div>
            )}

{/* email avec verification si le mail est vide ou invalide et placeholder avec opacity*/}

            <label className="label text-black">Email</label>
            <input 
                type="email" 
                className="input placeholder-gray-400 text-black" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />

{/* verification si le mot de passe est vide ou trop court et placeholder avec opacity*/}

            <label className="label text-black">Password</label>
            <input 
                type="password" 
                className="input placeholder-gray-400 text-black" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="3"
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />
            {password && password.length < 5 && (
                <span className="text-red-500 text-xs">Le mot de passe doit contenir au moins 5 caractères</span>
            )}

{/* bouton de connexion/s'inscrire */}

            <div className="flex gap-2 mt-4">
                <button 
                    className={`btn flex-1 ${(isEmailValid && isPasswordValid) ? 'btn-neutral' : 'btn-disabled'}`}
                    disabled={!isEmailValid || !isPasswordValid}
                    onClick={handleSubmit}
                >
                    Se connecter
                </button>
                <button
                    className="btn btn-outline flex-1"
                    onClick={subscribe}
                >
                    S'inscrire
                </button>
            </div>
        </fieldset>
    );
};
