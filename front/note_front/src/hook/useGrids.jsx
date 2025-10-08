import { useEffect, useRef, useState } from 'react';
import { useInstanceAxios } from './useInstanceAxios';

export function useGrids(defaultGridSize = { width: 800, height: 600 }) {
  const api = useInstanceAxios();

  const [groups, setGroups] = useState([]);
  
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [gridSize, setGridSize] = useState(defaultGridSize);


  // guards
  const loadedRef = useRef(false);
  const addInFlightRef = useRef({});
  const bootstrappingRef = useRef(false);
  const loadingRef = useRef(true);
    const addPrefix = (baseName) => {
        const count = groups.length + 1;
        return `${baseName} ${count}`;
    };

  // Load ALL groups + grids from backend
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const load = async () => {
            console.log('🔄 Chargement des groupes, grilles et notes...');
            try {
                let rawGroups = [];
                try {
                    const resGroups = await api.get('/groups/all');
                    rawGroups = Array.isArray(resGroups?.data) ? resGroups.data : [];
                    console.log('✅ Groupes chargés:', rawGroups.length);
                } catch (err) {
                    console.error('❌ Erreur chargement groupes:', err);
                }

                const groupsWithGrids = await Promise.all(
                    rawGroups.map(async (g) => {
                        let grids = [];
                        try {
                            const resGrids = await api.get(`/grid/by-group/${g.id}`);
                            grids = Array.isArray(resGrids?.data) ? resGrids.data : [];
                        } catch (err) {
                            console.error(`❌ Erreur chargement grilles du groupe ${g.id}:`, err);
                        }

                        const gridsWithNotes = await Promise.all(
                            grids.map(async (grid) => {
                                let notes = [];
                                try {
                                    const resNotes = await api.get(`/note/by-grid/${grid.id}`);
                                    notes = Array.isArray(resNotes?.data) ? resNotes.data : [];
                                } catch (err) {
                                    console.error(`❌ Erreur chargement notes de la grille ${grid.id}:`, err);
                                }

                                return {
                                    id: grid.id,
                                    name: grid.grid_name || 'Sans nom',
                                    size: {
                                        width: Number(grid.grid_L) || defaultGridSize.width,
                                        height: Number(grid.grid_H) || defaultGridSize.height,
                                    },
                                    notes: notes.map(n => ({ id: n.id, content: n.content || '' }))
                                };
                            })
                        );

                        return {
                            id: g.id,
                            name: g.group_name || 'Sans nom',
                            grids: gridsWithNotes
                        };
                    })
                );

                setGroups(groupsWithGrids);
                console.log('✅ Chargement complet terminé');

            } catch (e) {
                console.error('❌ Erreur générale chargement:', e);
                setGroups([]);
            } finally {
                loadingRef.current = false;
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Select first grid by default
  useEffect(() => {
    if (groups.length > 0 && !selectedGrid) {
      const firstGridGroup = groups.find(g => g.grids?.length > 0);
      if (firstGridGroup && firstGridGroup.grids[0]) {
        setSelectedGrid(firstGridGroup.grids[0]);
        console.log('✅ Grille sélectionnée par défaut:', firstGridGroup.grids[0].name);
      }
    }
  }, [groups, selectedGrid]);

  // Keep gridSize in sync with selectedGrid
  useEffect(() => {
    if (selectedGrid) {
      setGridSize(selectedGrid.size || defaultGridSize);
    }
  }, [selectedGrid, defaultGridSize]);


    const renameGroup = (groupId, newName) => {
        if (!newName?.trim()) return;
        setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g)));
        // Plus besoin de addPrefix
        api.patch(`/groups/${groupId}`, { group_name: newName }).catch(() => {});
    };

    const addGroup = () => {
        const userId = sessionStorage.getItem('id_user');
        if (!userId) {
            console.error('❌ Utilisateur non connecté');
            return;
        }

        const payload = {
            group_name: addPrefix('Nouveau Groupe'),
            user: { id: userId }  // ✅ Association au user connecté
        };

        api
            .post('/groups/', payload)
            .then((res) => {
                const g = res.data;
                const newGroup = { id: g.id, name: g.group_name, grids: [] };
                setGroups((prev) => [...prev, newGroup]);
                console.log('✅ Nouveau groupe créé pour l’utilisateur', userId);
            })
            .catch((e) => console.error('Erreur création groupe:', e));
    };

    const addGrid = (groupId) => {
        const target = groups.find((g) => g.id === groupId);
        if (!target) return;

        const name = `Grille ${(target.grids?.length || 0) + 1}`;
        const payload = {
            grid_name: name,
            grid_L: defaultGridSize.width,
            grid_H: defaultGridSize.height,
            groups: { id: groupId },
        };

        api
            .post('/grid/', payload)
            .then((res) => {
                const gr = res.data;
                const newGrid = {
                    id: gr.id,
                    name: gr.grid_name,
                    size: { width: gr.grid_L, height: gr.grid_H },
                };

                //  On ajoute à la liste existante sans la remplacer
                setGroups((prev) =>
                    prev.map((g) =>
                        g.id === groupId
                            ? { ...g, grids: [...(g.grids || []), newGrid] }
                            : g
                    )
                );

                setSelectedGrid(newGrid);
            })
            .catch((e) => console.error('Erreur création grille:', e));
    };

  const deleteGrid = (groupId, gridId, { onDeleted } = {}) => {
    setGroups((prev) => {
      const next = prev.map((g) => {
        if (g.id !== groupId) return g;
        const newGrids = (g.grids || []).filter((grid) => grid.id !== gridId);
        return { ...g, grids: newGrids };
      });

      if (selectedGrid && selectedGrid.id === gridId) {
        const newSelected = next.find((g) => g.grids?.length)?.grids?.[0] || null;
        setSelectedGrid(newSelected);
      }

      onDeleted?.(gridId);
      return next;
    });
    api.delete(`/grid/${gridId}`).catch(() => {});
  };

  const deleteGroup = (groupId, { onDeleted } = {}) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      const removedGridIds = (group?.grids || []).map((gr) => gr.id);
      const next = prev.filter((g) => g.id !== groupId);

      if (removedGridIds.includes(selectedGrid?.id)) {
        const newSelected = next.find((g) => g.grids?.length)?.grids?.[0] || null;
        setSelectedGrid(newSelected);
      }

      onDeleted?.(removedGridIds);
      return next;
    });
    api.delete(`/groups/${groupId}`).catch(() => {});
  };

    const handleAddFirstGrid = () => {
        const userId = sessionStorage.getItem('id_user');
        if (!userId) {
            console.error('❌ Utilisateur non connecté');
            return;
        }

        if (groups.length === 0) {
            api
                .post('/groups/', {
                    group_name: 'Nouveau Groupe',
                    user: { id: userId }
                })
                .then((res) => {
                    const g = res.data;
                    const newGroup = { id: g.id, name: g.group_name, grids: [] };
                    setGroups([newGroup]);
                    const payload = {
                        grid_name: 'Nouvelle Grille',
                        grid_L: defaultGridSize.width,
                        grid_H: defaultGridSize.height,
                        groups: { id: g.id },
                    };
                    return api.post('/grid/', payload).then((res) => {
                        const g = res?.data;
                        if (!g) {
                            console.error("⚠️ Réponse vide de l’API pour la grille !");
                            return;
                        }

                        const newGrid = {
                            id: g.id,
                            name: g.grid_name,
                            size: { width: g.grid_L, height: g.grid_H },
                        };

                        setGroups((prev) =>
                            prev.map((pg) =>
                                pg.id === newGroup.id ? { ...pg, grids: [newGrid] } : pg
                            )
                        );
                        setSelectedGrid(newGrid);
                    });

                })
                .catch((e) => console.error('Erreur ajout première grille:', e));
        } else {
            addGrid(groups[0].id);
        }
    };

  const updateGridSize = (newSize) => {
    if (!selectedGrid) return;
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
    setGridSize((prev) => ({ ...prev, ...newSize }));
    api
      .patch(`/grid/${selectedGrid.id}`, {
        grid_L: newSize.width,
        grid_H: newSize.height,
      })
      .catch(() => {});
  };

    const renameGrid = (groupId, gridId, newName) => {
        if (!newName?.trim()) return;
        setGroups((prev) =>
            prev.map((g) =>
                g.id === groupId
                    ? {
                        ...g,
                        grids: (g.grids || []).map((gr) => (gr.id === gridId ? { ...gr, name: newName } : gr)),
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
