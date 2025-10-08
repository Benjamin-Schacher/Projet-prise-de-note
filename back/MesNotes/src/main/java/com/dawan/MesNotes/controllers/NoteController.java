package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.services.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/note")
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Note> saveOrUpdate(@RequestBody Note note) {
        Note savedNote = service.saveOrUpdate(note);
        return ResponseEntity.status(201).body(savedNote);
    }

    @GetMapping("/by-grid/{gridId}")
    public ResponseEntity<List<Note>> byGrid(@PathVariable Long gridId) {
        return ResponseEntity.ok(service.findByGrid_Id(gridId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Note>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.findByUserId(userId));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Note supprimée");
    }
    @PatchMapping("/{id}")
    public ResponseEntity<Note> patchNote(@PathVariable Long id, @RequestBody Note note) {
        Note existing = service.byId(id).orElseThrow(() -> new RuntimeException("Note not found"));
        if (note.getTitle() != null) existing.setTitle(note.getTitle());
        if (note.getContent() != null) existing.setContent(note.getContent());
        existing.setPos_x(note.getPos_x());
        existing.setPos_y(note.getPos_y());
        existing.set_grid(note.is_grid());
        Note updated = service.saveOrUpdate(existing);
        return ResponseEntity.ok(updated);
    }

}
