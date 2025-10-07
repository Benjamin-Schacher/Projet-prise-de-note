package com.dawan.MesNotes.security.error401;

import java.io.IOException;

import com.dawan.MesNotes.dto.ApiErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
// Erreur 401
@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        // Log pour le développeur
        log.warn("Tentative d'accès non autorisée sur l'URL {} : {}", request.getRequestURI(), authException.getMessage());

        // Message personnalisé pour l'utilisateur
        String userMessage = "Vous devez être connecté pour accéder à cette ressource.";

        ApiErrorDto error = ApiErrorDto.builder()
                .message(userMessage)
                .status(HttpStatus.UNAUTHORIZED)
                .build();

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        mapper.writeValue(response.getOutputStream(), error);
    }
}




