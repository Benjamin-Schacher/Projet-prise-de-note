package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.groups;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.GroupsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GroupsService extends GenericService<groups, Long, GroupsRepository> {
    public GroupsService(GroupsRepository repo) {
        super(repo);
    }

    // Retourner tous les groupes (pour admin ou debug)
    public List<groups> allAsList() {
        return repo.findAll();
    }


    public List<groups> findByUserId(Long userId) {
        return repo.findByUserIdWithGrids(userId);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        // Cascade DELETE gère automatiquement : groups → grids → notes
        repo.deleteById(id);
    }
}
