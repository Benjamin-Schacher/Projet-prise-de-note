package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Grid;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.GridService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("grid/")
public class GridController extends GenericController<Grid, Long, GridService> {
    public GridController(GridService service) { super(service); }

    @GetMapping("/by-group/{id}")
    public ResponseEntity<List<Grid>> byGroup(@PathVariable Long id) {
        return ResponseEntity.ok(service.findByGroupsId(id));
    }
}
