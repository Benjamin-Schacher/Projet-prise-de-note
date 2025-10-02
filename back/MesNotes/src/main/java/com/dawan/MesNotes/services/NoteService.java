package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService extends GenericService<Note, Long, NoteRepository> {

    public NoteService(NoteRepository repo) {
        super(repo);
    }


    public List<Note> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
}
