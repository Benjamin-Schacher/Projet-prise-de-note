import { useEffect, useRef, useState } from 'react';
import { useInstanceAxios } from './useInstanceAxios';

export function useGrids(defaultGridSize = { width: 800, height: 600 }) {
    const api = useInstanceAxios();

    const [groups, setGroups] = useState([]);
    const [selectedGrid, setSelectedGrid] = useState(null);
    const [gridSize, setGridSize] = useState(defaultGridSize);
    const [userId, setUserId] = useState(sessionStorage.getItem('id_user'));

    const loadedRef = useRef(null);

    // 🔄 Détecter les changements d'utilisateur dans sessionStorage
    useEffect(() => {
        const checkUser = () => {
            const newId = sessionStorage.getItem('id_user');
            if (newId !== userId) {
                console.log('👤 Changement d’utilisateur détecté → rechargement...');
                setUserId(newId);
                setGroups([]);
                setSelectedGrid(null);
                loadedRef.current = null; // reset pour recharger les données
            }
        };

        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, [userId]);

    // 🚀 Chargement des groupes/grilles pour le user courant
    useEffect(() => {
        const currentUserId = sessionStorage.getItem('id_user');
        if (!currentUserId) {
            console.warn('⚠️ Aucun utilisateur connecté, réinitialisation des groupes');
            setGroups([]);
            setSelectedGrid(null);
            return;
        }

        if (loadedRef.current === currentUserId) return;
        loadedRef.current = currentUserId;

        const load = async () => {
            console.log('🔄 Chargement des groupes et grilles pour user', currentUserId);
            try {
                // 🔹 Récupération des groupes de l’utilisateur
                const resGroups = await api.get(`/groups/user/${currentUserId}`);
                const rawGroups = Array.isArray(resGroups?.data) ? resGroups.data : [];

                const groupsWithGrids = await Promise.all(
                    rawGroups.map(async (g) => {
                        let grids = [];
                        try {
                            const resGrids = await api.get(`/grid/by-group/${g.id}`);
                            grids = Array.isArray(resGrids?.data) ? resGrids.data : [];
                        } catch (err) {
                            console.error(`❌ Erreur chargement grilles du groupe ${g.id}:`, err);
                        }

                        return {
                            id: g.id,
                            name: g.group_name || 'Sans nom',
                            grids: grids.map((grid) => ({
                                id: grid.id,
                                name: grid.grid_name || 'Sans nom',
                                size: {
                                    width: Number(grid.grid_L) || defaultGridSize.width,
                                    height: Number(grid.grid_H) || defaultGridSize.height,
                                },
                                notes: [],
                            })),
                        };
                    })
                );

                setGroups(groupsWithGrids);
                console.log(`✅ ${groupsWithGrids.length} groupes chargés pour user ${currentUserId}`);
            } catch (err) {
                console.error('❌ Erreur chargement groupes:', err);
                setGroups([]);
            }
        };

        load().catch(err => console.error('Erreur load() dans useEffect:', err));
    }, [api, defaultGridSize, userId]);

    // Sélectionne la première grille dispo si aucune sélectionnée
    useEffect(() => {
        if (groups.length > 0 && !selectedGrid) {
            const firstGridGroup = groups.find((g) => g.grids?.length > 0);
            if (firstGridGroup && firstGridGroup.grids[0]) {
                setSelectedGrid(firstGridGroup.grids[0]);
                console.log('✅ Grille sélectionnée par défaut:', firstGridGroup.grids[0].name);
            }
        }
    }, [groups, selectedGrid]);

    // Synchronise la taille de grille sélectionnée
    useEffect(() => {
        if (selectedGrid) {
            // Ne mettre à jour que si gridSize différent de selectedGrid.size
            if (!gridSize || gridSize.width !== selectedGrid.size.width || gridSize.height !== selectedGrid.size.height) {
                setGridSize(selectedGrid.size || defaultGridSize);
            }
        }
    }, [selectedGrid, defaultGridSize]);


    // --- 🧱 Fonctions CRUD ---
    const renameGroup = (groupId, newName) => {
        if (!newName?.trim()) return;
        setGroups((prev) =>
            prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
        );
        api.patch(`/groups/${groupId}`, { group_name: newName }).catch(() => {});
    };

    const addPrefix = (baseName) => `${baseName} ${groups.length + 1}`;

    const addGroup = () => {
        const userId = sessionStorage.getItem('id_user');
        if (!userId) return console.error('❌ Utilisateur non connecté');

        const payload = {
            group_name: addPrefix('Nouveau Groupe'),
            user: { id: userId },
        };

        api.post('/groups/', payload)
            .then((res) => {
                const g = res.data;
                const newGroup = { id: g.id, name: g.group_name, grids: [] };
                setGroups((prev) => [...prev, newGroup]);
            })
            .catch((e) => console.error('Erreur création groupe:', e));
    };

    const addGrid = (groupId) => {
        const target = groups.find((g) => g.id === groupId);
        if (!target) return;

        const payload = {
            grid_name: `Grille ${(target.grids?.length || 0) + 1}`,
            grid_L: defaultGridSize.width,
            grid_H: defaultGridSize.height,
            groups: { id: groupId },
        };

        api.post('/grid/', payload)
            .then((res) => {
                const gr = res.data;
                const newGrid = {
                    id: gr.id,
                    name: gr.grid_name,
                    size: { width: gr.grid_L, height: gr.grid_H },
                };

                setGroups((prev) =>
                    prev.map((g) =>
                        g.id === groupId ? { ...g, grids: [...(g.grids || []), newGrid] } : g
                    )
                );
                setSelectedGrid(newGrid);
            })
            .catch((e) => console.error('Erreur création grille:', e));
    };

    const deleteGrid = (groupId, gridId, { onDeleted } = {}) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.id === groupId
                    ? { ...g, grids: g.grids.filter((grid) => grid.id !== gridId) }
                    : g
            )
        );
        if (selectedGrid?.id === gridId) setSelectedGrid(null);
        api.delete(`/grid/${gridId}`).catch(() => {});
        onDeleted?.(gridId);
    };

    const deleteGroup = (groupId, { onDeleted } = {}) => {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        if (selectedGrid && groups.some((g) => g.id === groupId)) {
            setSelectedGrid(null);
        }
        api.delete(`/groups/${groupId}`).catch(() => {});
        onDeleted?.();
    };

    const handleAddFirstGrid = () => {
        const userId = sessionStorage.getItem('id_user');
        if (!userId) return console.error('❌ Utilisateur non connecté');

        if (groups.length === 0) {
            api
                .post('/groups/', { group_name: 'Nouveau Groupe', user: { id: userId } })
                .then((res) => {
                    const g = res.data;
                    const newGroup = { id: g.id, name: g.group_name, grids: [] };
                    setGroups([newGroup]);
                    addGrid(g.id);
                })
                .catch((e) => console.error('Erreur ajout première grille:', e));
        } else {
            addGrid(groups[0].id);
        }
    };

    const updateGridSize = (newSize) => {
        if (!selectedGrid) return;

        // Mise à jour dans groups
        setGroups((prev) =>
            prev.map((g) => ({
                ...g,
                grids: (g.grids || []).map((grid) =>
                    grid.id === selectedGrid.id
                        ? { ...grid, size: { ...grid.size, ...newSize } }
                        : grid
                ),
            }))
        );

        // Mise à jour du selectedGrid lui-même
        setSelectedGrid((prev) => prev ? { ...prev, size: { ...prev.size, ...newSize } } : prev);

        // Mise à jour de gridSize pour les composants dépendants
        setGridSize((prev) => ({ ...prev, ...newSize }));

        // Patch côté backend
        api.patch(`/grid/${selectedGrid.id}`, {
            grid_L: newSize.width,
            grid_H: newSize.height,
        }).catch(() => {});
    };


    const renameGrid = (groupId, gridId, newName) => {
        if (!newName?.trim()) return;
        setGroups((prev) =>
            prev.map((g) =>
                g.id === groupId
                    ? {
                        ...g,
                        grids: g.grids.map((gr) =>
                            gr.id === gridId ? { ...gr, name: newName } : gr
                        ),
                    }
                    : g
            )
        );
        api.patch(`/grid/${gridId}`, { grid_name: newName }).catch(() => {});
    };

    return {
        groups,
        setGroups,
        selectedGrid,
        setSelectedGrid,
        gridSize,
        setGridSize,
        renameGroup,
        renameGrid,
        addGroup,
        addGrid,
        deleteGrid,
        deleteGroup,
        handleAddFirstGrid,
        updateGridSize,
    };
}
