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
    const isPasswordValid = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\s]).{12,}$";
    const doPasswordsMatch = password === confirmPassword;
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

/* bouton d'inscription */

    const subscribe = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Réinitialiser les messages d'erreur
        
        if (!isEmailValid || !isPasswordValid || !doPasswordsMatch || !prenom || !nom) {
            setErrorMessage('Veuillez remplir correctement tous les champs');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: prenom + nom,
                    email: email,
                    password: password
                }),
            });

            // Gestion de la réponse réussie
            if (response.ok) {
                setErrorMessage('Inscription réussie ! Redirection...');
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/connexion');
                }, 2000);
                return;
            }

            // Gestion des erreurs
            let errorMessage = 'Une erreur est survenue';

            try {
                const contentType = response.headers.get('content-type');
                let responseData;

                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                    errorMessage = responseData.message || errorMessage;
                } else {
                    const text = await response.text();
                    try {
                        // Essayer de parser comme JSON au cas où le content-type serait incorrect
                        responseData = JSON.parse(text);
                        errorMessage = responseData.message || errorMessage;
                    } catch {
                        // Si ce n'est pas du JSON, utiliser le texte brut
                        errorMessage = text || errorMessage;
                    }
                }

                // Simplifier les messages d'erreur courants
                if (errorMessage.includes('déjà pris') || errorMessage.includes('already taken')) {
                    errorMessage = 'Ce nom d\'utilisateur est déjà pris.';
                } else if (errorMessage.includes('email') && errorMessage.includes('existe')) {
                    errorMessage = 'Cette adresse email est déjà utilisée';
                }

            } catch (error) {
                console.error('Erreur lors du traitement de la réponse:', error);
                errorMessage = 'Erreur lors du traitement de la réponse du serveur';
            }

            setErrorMessage(errorMessage);
            setIsSuccess(false);
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage('Une erreur est survenue lors de la connexion au serveur');
            setIsSuccess(false);
        }
    };

/* bouton de retour au login */

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/connexion');
    };

    return (

    //boite de connexion
         <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-lg border pt-6 px-4 pb-4">
            <h2 className="text-black text-lg font-bold mb-4 text-center">Inscription</h2>

            {errorMessage && (
                <div className={`text-sm mb-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
                    {isSuccess ? (
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {errorMessage}
                        </div>
                    ) : errorMessage}
                </div>
            )}

{/*nom avec verification si le nom est vide et placeholder avec opacity*/}

            <label className="label text-black">Nom</label>
            <input
                type="text"
                className="input placeholder-gray-400 text-black"
                //placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />

{/*prenom avec verification si le prenom est vide et placeholder avec opacity*/}

            <label className="label text-black">Prénom</label>
            <input
                type="text"
                className="input placeholder-gray-400 text-black"
                //placeholder="Prénom"
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
                //placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />

{/*mot de passe avec verification si le mot de passe est vide ou trop court et placeholder avec opacity*/}

            <label className="label text-black">Mot de passe</label>
            <input
                type="password"
                className="input placeholder-gray-400 text-black"
                //placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="12"
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />
            {password && !password.match(isPasswordValid) && (
                <span className="text-red-500 text-xs">Le mot de passe doit contenir au moins 12 caractères, 
                    avec une majuscule, une minuscule, un chiffre et un caractère spécial.</span>
            )}
            <label className="label text-black">Confirmation du mot de passe</label>

{/*verification si les mots de passe sont identiques et placeholder avec opacity*/}

            <input
                type="password"
                className="input placeholder-gray-400 text-black"
                //placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="5"
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }}
                required
            />
            {confirmPassword && !doPasswordsMatch && (
                <span className="text-red-500 text-xs">Les mots de passe ne correspondent pas...</span>
            )}

{/* bouton de retour au login et de s'inscrire avec test des conditions precedents*/}

            <div className="flex gap-2 mt-4">
                <button
                    className="btn btn-outline flex-1"
                    onClick={handleSubmit}
                >
                    Connexion
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
