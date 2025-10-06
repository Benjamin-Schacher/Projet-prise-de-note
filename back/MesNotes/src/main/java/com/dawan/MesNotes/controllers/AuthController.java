package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/inscription")
    public ResponseEntity<?> showResgister(@Valid @RequestBody User user){
        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
        }
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Cette email est déjà utilisé.");
        }

        userRepository.save(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Inscription réussie", "user", user));
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> showLogin(@Valid @RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Email invalide");
        }

        User foundUser = existingUser.get();

        if (!foundUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.badRequest().body("Mot de passe incorrect");
        }

        return ResponseEntity.ok(Map.of(
                "message", "Connexion réussie",
                "user", foundUser,
                "userId", foundUser.getId()
        ));
    }

}