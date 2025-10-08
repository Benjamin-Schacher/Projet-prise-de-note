
package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.groups;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.GroupsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("groups/")
public class GroupsController extends GenericController<groups, Long, GroupsService> {
    public GroupsController(GroupsService service) {
        super(service);
    }

    @GetMapping("/all")
    public ResponseEntity<List<groups>> allAsList() {
        return ResponseEntity.ok(service.allAsList());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<groups>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.findByUserId(userId));
    }

    // ÉTAPE 5 : Override create pour s'assurer que l'utilisateur est associé
    @PostMapping
    @Override
    public ResponseEntity<groups> save(@RequestBody groups entity) {
        // ici tu peux forcer la liaison à l’utilisateur, par exemple vérifier que entity.user != null
        return super.save(entity);
    }
}