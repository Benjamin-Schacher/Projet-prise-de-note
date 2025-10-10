package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.NoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    @GetMapping("/by-grid/{gridId}")
    public ResponseEntity<List<Note>> byGrid(@PathVariable Long gridId) {
        return ResponseEntity.ok(service.findByGrid_Id(gridId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Note>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.findByUserId(userId));
    }


    @PatchMapping("/note_with_grid/{id}")
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
