package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("note/")
public class NoteController extends GenericController<Note, Long, NoteService> {

    public NoteController(NoteService service) {
        super(service);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Note>> getByUserId(@PathVariable Long id) {
        List<Note> notes = service.getByUserId(id);
        if (notes.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(notes);
    }
}
