package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Page<Note> findByUser(User user, Pageable pageable);
    List<Note> findByGrid_Id(Long gridId);
    List<Note> findByUserId(Long userId);
}
