import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Subscribe = () => {
    const navigate = useNavigate();
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 5;
    const doPasswordsMatch = password === confirmPassword;

/* bouton d'inscription */

    const subscribe = (e) => {
        e.preventDefault();
        if (!isEmailValid || !isPasswordValid || !doPasswordsMatch || !prenom || !nom) return;
        console.log('Tentative d\'inscription avec:', email);
        navigate('/');
    };

/* bouton de retour au login */

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/connexion');
    };

    return (

//boite de connexion

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border pt-6 px-4 pb-4">
            <h2 className="text-black text-lg font-bold mb-4 text-center">Login</h2>

{/*nom avec verification si le nom est vide et placeholder avec opacity*/}

            <label className="label text-black">Nom</label>
            <input
                type="text"
                className="input placeholder-gray-400 text-black"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />

{/*prenom avec verification si le prenom est vide et placeholder avec opacity*/}

            <label className="label text-black">Prenom</label>
            <input
                type="text"
                className="input placeholder-gray-400 text-black"
                placeholder="Prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />

{/*email avec verification si le mail est vide ou invalide et placeholder avec opacity*/}

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

{/*mot de passe avec verification si le mot de passe est vide ou trop court et placeholder avec opacity*/}

            <label className="label text-black">Password</label>
            <input
                type="password"
                className="input placeholder-gray-400 text-black"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="5"
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />
            {password && password.length < 5 && (
                <span className="text-red-500 text-xs">Le mot de passe doit contenir au moins 5 caractères</span>
            )}
            <label className="label text-black">Confirmation du mot de passe</label>

{/*verification si les mots de passe sont identiques et placeholder avec opacity*/}

            <input
                type="password"
                className="input placeholder-gray-400 text-black"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="5"
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />
            {confirmPassword && !doPasswordsMatch && (
                <span className="text-red-500 text-xs">Les mots de passe ne correspondent pas</span>
            )}

{/* bouton de retour au login et de s'inscrire avec test des conditions precedents*/}

            <div className="flex gap-2 mt-4">
                <button
                    className="btn btn-outline flex-1"
                    onClick={handleSubmit}
                >
                    retour au login
                </button>
                <button
                    className={`btn flex-1 ${(isEmailValid && isPasswordValid && doPasswordsMatch && nom && prenom) ? 'btn-neutral' : 'btn-disabled'}`}
                    disabled={!isEmailValid || !isPasswordValid || !doPasswordsMatch || !nom || !prenom}
                    onClick={subscribe}
                >
                    S'inscrire
                </button>
            </div>
        </fieldset>
    );
};
