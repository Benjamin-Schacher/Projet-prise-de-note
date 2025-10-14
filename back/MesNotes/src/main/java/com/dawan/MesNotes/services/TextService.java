package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.Text;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.TextRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TextService extends GenericService<Text, Long, TextRepository> {
    public TextService(TextRepository repo) {
        super(repo);
    }

    public Optional<Text> findById(Long id) {
        return repo.findById(id);
    }

    public List<Text> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
}
