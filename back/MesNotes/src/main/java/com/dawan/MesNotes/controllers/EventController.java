package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Event;
import com.dawan.MesNotes.entities.Note;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.EventService;
import com.dawan.MesNotes.services.NoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("event/")
public class EventController extends GenericController<Event, Long, EventService> {

    public EventController(EventService service) {
        super(service);
    }

    @GetMapping("/mesEvent")
    public Page<Event> showEvent(Pageable pageable) {
        return service.all(pageable);
    }

    @GetMapping("/searchAfterDate")
    public Page<Event> searchEventsAfterDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            Pageable pageable) {
        return service.findByDateAfter(startDate, pageable);
    }
}
