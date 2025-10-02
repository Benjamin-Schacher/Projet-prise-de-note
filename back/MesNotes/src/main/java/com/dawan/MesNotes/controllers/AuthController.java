package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.dto.UserDTO;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.mappers.UserMapper;
import com.dawan.MesNotes.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class AuthController {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostMapping("/inscription")
    public ResponseEntity<?> showResgister(@Valid @RequestBody User user){
        if(!user.getEmail().matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")){
            return ResponseEntity.badRequest().body("Veuillez entrer une adresse e-mail valide.");
        }
        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
        }
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Cette email est déjà utilisé.");
        }

        String encodePassword = passwordEncoder().encode(user.getPassword());
        if(!user.getPassword().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\s]).{12,}$")){
            return ResponseEntity.badRequest()
                    .body("Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.");
        }

        // Sauvegarde de l'utilisateur
        User savedUser = userRepository.save(user);

        // Conversion en DTO
        UserDTO userDTO = userMapper.userToUserDTO(savedUser);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Inscription réussie", "user", userDTO));
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> showLogin(@Valid @RequestBody User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Nom d'utilisateur ou mot de passe incorrect");
        }
        User foundUser = existingUser.get();
        if (!foundUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.badRequest().body("Nom d'utilisateur ou mot de passe incorrect");
        }

        // Conversion en DTO
        UserDTO userDTO = userMapper.userToUserDTO(foundUser);


        return ResponseEntity.ok(Map.of(
                "message", "Connexion réussie",
                "user", userDTO
        ));
    }
}
