package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.Text;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.services.TextService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/text")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TextController {

    private final TextService textService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<Page<Text>> getAll(Pageable pageable) {
        try{
            return ResponseEntity.ok().body(textService.all(pageable));
        } catch (DataIntegrityViolationException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Text>> getTextsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(textService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Text> createText(@RequestBody Map<String, Object> body) throws JsonProcessingException {

        Text text = new Text();
        text.setTitle((String) body.get("title"));

        // Convertir l'objet 'content' en chaîne JSON
        String contentAsString = objectMapper.writeValueAsString(body.get("content"));
        text.setContent(contentAsString);

        Map<String, Object> userMap = (Map<String, Object>) body.get("user");
        if (userMap != null) {
            User user = new User();
            user.setId(((Number) userMap.get("id")).longValue());
            text.setUser(user);
        }

        Text created = textService.saveOrUpdate(text);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteText(@PathVariable Long id) {
        textService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getText(@PathVariable Long id) {
        return textService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("{id}")
    public ResponseEntity<Text> update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Text> existingOpt = textService.byId(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Text existing = existingOpt.get();

        updates.forEach((field, value) -> {
            if ("id".equals(field)) return; // On ignore l'id
            try {
                Field f = existing.getClass().getDeclaredField(field);
                f.setAccessible(true);

                if ("content".equals(field)) {
                    ObjectMapper mapper = new ObjectMapper();
                    if (value instanceof Map || value instanceof List) {
                        f.set(existing, mapper.writeValueAsString(value));
                    } else if (value instanceof String) {
                        f.set(existing, value);
                    } else {
                        System.out.println("Type de content non supporté : " + value.getClass());
                    }
                } else {
                    f.set(existing, value);
                }

            } catch (NoSuchFieldException | IllegalAccessException | JsonProcessingException e) {
                e.printStackTrace(); // On voit exactement ce qui échoue
            }
        });

        Text updated = textService.saveOrUpdate(existing);
        return ResponseEntity.ok(updated);
    }

}

