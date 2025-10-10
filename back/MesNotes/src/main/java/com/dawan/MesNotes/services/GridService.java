package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.Grid;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.GridRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GridService extends GenericService<Grid, Long, GridRepository> {
    public GridService(GridRepository repo) {
        super(repo);
    }

    public List<Grid> findByGroupsId(Long id) { return repo.findByGroupsId(id); }
}
