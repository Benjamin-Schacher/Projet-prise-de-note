import { HeaderItem } from "./HeaderItem";

export const Navbar = () => {
    return (
        <div className="navbar px-5 shadow-lg navbar bg-primary text-primary-content">
            <nav className="w-full">
                <div className="m-auto w-fit">
                    <ul className="flex items-center gap-10">
                        <li>
                            <HeaderItem href="/">Accueil</HeaderItem>
                        </li>
                        <li>
                            <HeaderItem href="/note">note</HeaderItem>
                        </li>
                        <li>
                            <HeaderItem href="/connexion">Login</HeaderItem>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};