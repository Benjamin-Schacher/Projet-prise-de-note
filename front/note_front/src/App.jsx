import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './App.css'
import {Navbar} from "./components/Navbar.jsx"
import {HomePage} from "./pages/HomePage.jsx"
import {Login} from "./pages/Login.jsx"
import {Note} from "./pages/Note.jsx"
import {Subscribe} from "./pages/Subscribe.jsx"

    function App() {
        const router = createBrowserRouter([
            {
                path: "",
                element: <Root />,
                children: [
                    { path: "", element: <HomePage /> },
                    { path: "/note", element: <Note /> },
                    { path: "/connexion", element: <Login /> },
                    { path: "/subscribe", element: <Subscribe /> },
                ],
            },
        ]);

        function Root() {
            return (
                <>
                    <Navbar />
                    <div className="app-container">
                        <Outlet />
                    </div>
                </>
            );
        }

        return <RouterProvider router={router} />;
    }

    export default App;
