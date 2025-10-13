package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.Event;
import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.EventRepository;
import com.dawan.MesNotes.repositories.NoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class EventService extends GenericService<Event, Long, EventRepository> {

    public EventService(EventRepository repo) {
        super(repo);
    }

    public Page<Event> all(Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repo.findByUser(currentUser, pageable);
    }

    public Page<Event> findByDateAfter(LocalDateTime startDate, Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repo.findByStartDateAfterAndUser(startDate, currentUser, pageable);
    }
}
