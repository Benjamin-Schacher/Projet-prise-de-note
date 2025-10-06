package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.NoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("note/")
@SuppressWarnings("unused")
public class NoteController extends GenericController<Note, Long, NoteService> {

    public NoteController(NoteService service) {
        super(service);
    }

    @GetMapping("/mesNotes")
    public Page<Note> showNotes(Pageable pageable) {
        return service.all(pageable);
    }
}
