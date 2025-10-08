export function Calendar({  }) {

    // Au début de vie de la page, vérifier si utilisateur connecter et récupérer son id ou le rediriger vers la page de connection
    useEffect(() => {
    	const fetchEvents = async () => {
    		const idUser = sessionStorage.getItem("id_user");
    		if (idUser) {
    			await getAllEvents(idUser);
    		} else {
    			navigate("/connexion");
    		}
    	};

    	// appel de la fonction pour récupérer les events de l'utilisateur
    	fetchEvents();

    	return () => {
    	};
    }, [navigate]);


	return (
	);
}
