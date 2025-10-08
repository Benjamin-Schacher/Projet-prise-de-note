package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.I_GenericService;
import com.dawan.MesNotes.repositories.NoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService implements I_GenericService<Note, Long> {

    private final NoteRepository repository;

    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<Note> all(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<Note> byId(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Note saveOrUpdate(Note entity) {
        return repository.save(entity);
    }

    // Méthodes spécifiques aux Notes
    public List<Note> findByGrid_Id(Long gridId) {
        return repository.findByGrid_Id(gridId);
    }

    public List<Note> findByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

}

