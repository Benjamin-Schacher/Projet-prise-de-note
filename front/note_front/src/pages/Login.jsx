import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\s]).{12,}$";
    const { login, setToken } = useAuth();
    const isPasswordValid = password.length >= 12;

/* bouton de connexion */

    const handleSubmit = async (e) => {
    	e.preventDefault();
    	if (!isEmailValid || !isPasswordValid) return;

    	try {
    		await login({ email, password });
    		setIsSuccess(true);
    		setLoginMessage('Connexion réussie ! Redirection en cours...');

    		setTimeout(() => {
    			navigate('/');
    		}, 1500);
    	} catch (err) {
    		console.error('Erreur de connexion:', err);
    		setIsSuccess(false);
    		setLoginMessage('Identifiants invalides ou erreur serveur');
    	}
    };

/* bouton d'inscription */

    const subscribe = (e) => {
        e.preventDefault();
        navigate('/subscribe');
    };

/* boite de connexion */

    return (
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-lg border pt-6 px-4 pb-4">
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
                    //placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                    required
                />

    {/* verification si le mot de passe est vide ou trop court et placeholder avec opacity*/}

                <label className="label text-black">Mot de passe</label>
                <input 
                    type="password" 
                    className="input placeholder-gray-400 text-black" 
                    //placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="3"
                    style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                    required
                />

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
                        Inscription
                    </button>
                </div>
            </fieldset>

    );
};
