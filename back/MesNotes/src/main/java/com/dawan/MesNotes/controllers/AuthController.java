package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.dto.UserDTO;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.mappers.UserMapper;
import com.dawan.MesNotes.repositories.UserRepository;
import com.dawan.MesNotes.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@SuppressWarnings("unused")
@Slf4j
public class AuthController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private static final Pattern EMAIL_REGEX = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_REGEX = Pattern.compile("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\s]).{12,}$");

    private ResponseEntity<Map<String, String>> error(String message) {
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    @PostMapping("/inscription")
    public ResponseEntity<?> showRegister(@Valid @RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent())
            return error("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");

        if (!EMAIL_REGEX.matcher(user.getEmail()).matches())
            return error("Veuillez entrer une adresse e-mail valide.");

        if (userRepository.findByEmail(user.getEmail()).isPresent())
            return error("Cette email est déjà utilisé.");

        if (!PASSWORD_REGEX.matcher(user.getPassword()).matches())
            return error("Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.");

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        UserDTO userDTO = userMapper.userToUserDTO(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "Inscription réussie", "user", userDTO)
        );
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> showLogin(@Valid @RequestBody User user) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
            if(authentication.isAuthenticated()){
                User foundUser = (User) authentication.getPrincipal();
                UserDTO userDTO = userMapper.userToUserDTO(foundUser);

                Map<String, Object> authData = new HashMap<>();
                authData.put("token", jwtUtils.createToken(foundUser));
                authData.put("type", "Bearer");
                authData.put("message", "Connexion réussie");
                authData.put("user", userDTO);
                return ResponseEntity.ok(authData);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error("Nom d'utilisateur ou mot de passe incorrect."));
        } catch (AuthenticationException exception){
            log.error(exception.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error("Nom d'utilisateur et/ou mot de passe incorrect."));
        }
    }
}
