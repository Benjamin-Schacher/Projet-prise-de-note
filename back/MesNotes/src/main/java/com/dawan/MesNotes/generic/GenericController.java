package com.dawan.MesNotes.generic;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@SuppressWarnings("unused")
public class GenericController <E, // entity
                                I, // id
                                S extends I_GenericService<E, I> // service
                               > {
    protected final S service;

    @GetMapping
    public ResponseEntity<Page<E>> all(Pageable pageable) {
        try{
            return ResponseEntity.ok().body(service.all(pageable));
        } catch (DataIntegrityViolationException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<E> byId(@PathVariable I id) {
        try{
            Optional<E> result = service.byId(id);
            return result.map(ResponseEntity::ok).orElseGet(
                    () -> ResponseEntity.notFound().build()
            );
        } catch (DataIntegrityViolationException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteById(@PathVariable I id) {
        try{
            if(service.byId(id).isPresent()){
                service.deleteById(id);
                return ResponseEntity.ok().body("L'élément a bien été supprimé.");
            } else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun élément trouvé !");
            }
        } catch (DataIntegrityViolationException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<E> save(@RequestBody E entity) {
        try{
            E createdEntity = service.saveOrUpdate(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEntity);
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.badRequest().body(null); // données invalides
        } catch (Exception ex) { // logguer l'erreur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // erreur imprévue
        }
    }

    @PatchMapping("{id}")
    public ResponseEntity<E> update(@PathVariable I id, @RequestBody Map<String, Object> updates) {
        Optional<E> existingOpt = service.byId(id);
        if(existingOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        E existing = existingOpt.get();

        updates.forEach((field, value) -> {
            try {
                Field f = existing.getClass().getDeclaredField(field);
                f.setAccessible(true);
                f.set(existing, value);
            } catch (NoSuchFieldException | IllegalAccessException e) {
            }
        });

        E updated = service.saveOrUpdate(existing);
        return ResponseEntity.ok(updated);
    }
}
