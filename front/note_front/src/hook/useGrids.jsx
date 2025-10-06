import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useGrids(defaultGridSize = { width: 800, height: 600 }) {
  const [groups, setGroups] = useState([
    {
      id: uuidv4(),
      name: 'Groupe 1',
      grids: [
        {
          id: uuidv4(),
          name: 'Grille 1',
          size: { ...defaultGridSize },
        },
      ],
    },
  ]);

  const [selectedGrid, setSelectedGrid] = useState(null);
  const [gridSize, setGridSize] = useState(defaultGridSize);

  // Select first grid by default
  useEffect(() => {
    if (groups.length > 0 && groups[0]?.grids?.length > 0 && !selectedGrid) {
      setSelectedGrid(groups[0].grids[0]);
    }
  }, [groups, selectedGrid]);

  // Keep gridSize in sync with selectedGrid
  useEffect(() => {
    if (selectedGrid) {
      setGridSize(selectedGrid.size || defaultGridSize);
    }
  }, [selectedGrid]);

  const renameGroup = (groupId, newName) => {
    if (!newName?.trim()) return;
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
  };

  const addGroup = () => {
    const newGroup = {
      id: uuidv4(),
      name: 'Nouveau Groupe',
      grids: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const addGrid = (groupId) => {
    setGroups((prev) => {
      const target = prev.find((g) => g.id === groupId) || prev[0];
      if (!target) return prev;
      const newGrid = {
        id: uuidv4(),
        name: `Grille ${(target.grids?.length || 0) + 1}`,
        size: { ...defaultGridSize },
      };
      const next = prev.map((g) =>
        g.id === target.id ? { ...g, grids: [...(g.grids || []), newGrid] } : g
      );
      // Select newly created grid
      setSelectedGrid(newGrid);
      return next;
    });
  };

  const deleteGrid = (groupId, gridId, { onDeleted } = {}) => {
    setGroups((prev) => {
      const next = prev.map((g) => {
        if (g.id !== groupId) return g;
        const newGrids = (g.grids || []).filter((grid) => grid.id !== gridId);
        return { ...g, grids: newGrids };
      });

      // If current grid was removed, pick a replacement
      if (selectedGrid && selectedGrid.id === gridId) {
        const newSelected = next.find((g) => g.grids?.length)?.grids?.[0] || null;
        setSelectedGrid(newSelected);
      }

      onDeleted?.(gridId);
      return next;
    });
  };

  const deleteGroup = (groupId, { onDeleted } = {}) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      const removedGridIds = (group?.grids || []).map((gr) => gr.id);
      const next = prev.filter((g) => g.id !== groupId);

      // Adjust selection
      if (removedGridIds.includes(selectedGrid?.id)) {
        const newSelected = next.find((g) => g.grids?.length)?.grids?.[0] || null;
        setSelectedGrid(newSelected);
      }

      onDeleted?.(removedGridIds);
      return next;
    });
  };

  const handleAddFirstGrid = () => {
    setGroups((prev) => {
      let next = prev;
      let targetGroupId;
      if (prev.length === 0) {
        const newGroup = { id: uuidv4(), name: 'Nouveau Groupe', grids: [] };
        next = [newGroup];
        targetGroupId = newGroup.id;
      } else {
        targetGroupId = prev[0].id;
      }
      const newGrid = { id: uuidv4(), name: 'Nouvelle Grille', size: { ...defaultGridSize } };
      const mapped = next.map((g) =>
        g.id === targetGroupId ? { ...g, grids: [...(g.grids || []), newGrid] } : g
      );
      setSelectedGrid(newGrid);
      return mapped;
    });
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
  };

  return {
    groups,
    setGroups,
    selectedGrid,
    setSelectedGrid,
    gridSize,
    setGridSize,
    renameGroup,
    addGroup,
    addGrid,
    deleteGrid,
    deleteGroup,
    handleAddFirstGrid,
    updateGridSize,
  };
}
