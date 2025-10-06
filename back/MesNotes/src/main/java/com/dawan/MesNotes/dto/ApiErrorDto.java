package com.dawan.MesNotes.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Getter
@Builder
public final class ApiErrorDto {

    private final HttpStatus status;

    private final LocalDateTime date = LocalDateTime.now();

    private final String message;
}

