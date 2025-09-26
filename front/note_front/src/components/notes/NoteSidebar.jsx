import React from 'react';
import { Group } from '../grid';
import Button from '../ui/Button';

const NoteSidebar = ({
  groups,
  selectedGrid,
  onSelectGrid,
  onAddGroup,
  onDeleteGroup,
  onRenameGroup,
  onAddGrid,
  onDeleteGrid,
  setGroups,
  setSelectedGrid,
  sidebarWidth = '16rem'
}) => {
  return (
    <div 
      className="bg-gray-900 text-white p-4 border-r border-gray-700 overflow-y-auto" 
      style={{ 
        width: sidebarWidth,
        height: 'calc(100vh - 4rem)',
        position: 'fixed',
        left: 0,
        top: '4rem'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Groupes</h2>
        <Button 
          onClick={onAddGroup}
          size="sm"
          variant="primary"
          title="Ajouter un groupe"
        >
          + Groupe
        </Button>
      </div>

      <div className="space-y-4">
        {groups.map(group => (
          <Group
            key={group.id}
            group={group}
            selectedGrid={selectedGrid}
            onSelect={onSelectGrid}
            onDelete={onDeleteGroup}
            onRename={onRenameGroup}
            onAddGrid={onAddGrid}
            onDeleteGrid={onDeleteGrid}
            groups={groups}
            setGroups={setGroups}
            setSelectedGrid={setSelectedGrid}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteSidebar;
