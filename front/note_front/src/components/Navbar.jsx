import { HeaderItem } from "./HeaderItem";
import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated, logout } = useAuth();
	const [isAuth, setIsAuth] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setIsAuth(isAuthenticated());
	}, [isAuthenticated]);

    // ce déconnecter, metre a jour le menu et rediriger
	const handleLogout = () => {
		const confirmLogout = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
        if (confirmLogout) {
            logout();
            setIsAuth(false);
            setIsOpen(false);
            navigate("/connexion");
        }
	};

	return (
		<div className={`navbar-container ${isOpen ? "open" : ""}`}>
			<nav>
				<div>
					<ul>
						<li>
							<HeaderItem href="/">Accueil</HeaderItem>
						</li>
						<li>
							<HeaderItem href="/note">Notes</HeaderItem>
						</li>
						<li>
							{isAuth ? (
								<button className="nav-btn-in" onClick={handleLogout}>
									Déconnexion
								</button>
							) : (
								<HeaderItem href="/connexion">Login</HeaderItem>
							)}
						</li>
					</ul>
				</div>
			</nav>

			<button className="nav-btn" onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? "Fermer le menu" : "Ouvrir le menu"}
			</button>
		</div>
	);
};
