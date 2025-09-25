package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
}
