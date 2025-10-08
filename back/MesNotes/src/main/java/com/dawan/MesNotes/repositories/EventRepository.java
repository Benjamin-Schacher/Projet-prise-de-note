package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.Event;
import com.dawan.MesNotes.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByStartDateAfterAndUser(LocalDateTime startDate, User user, Pageable pageable);
}
