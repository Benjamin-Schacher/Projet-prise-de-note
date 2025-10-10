package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.NoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService extends GenericService<Note, Long, NoteRepository> {

    public NoteService(NoteRepository repo) {
        super(repo);
    }

    public Page<Note> all(Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repo.findByUser(currentUser, pageable);
    }

    @Override
    public Optional<Note> byId(Long id) {
        return repo.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Note saveOrUpdate(Note entity) {
        return repo.save(entity);
    }

    // Méthodes spécifiques aux Notes
    public List<Note> findByGrid_Id(Long gridId) {
        return repo.findByGrid_Id(gridId);
    }

    public List<Note> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
}
