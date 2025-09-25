package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.NoteService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("note/")
public class NoteController extends GenericController<Note, Long, NoteService> {

    public NoteController(NoteService service) {
        super(service);
    }
}
