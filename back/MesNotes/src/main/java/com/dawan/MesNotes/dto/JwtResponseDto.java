package com.dawan.MesNotes.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
@SuppressWarnings("unused")
public class JwtResponseDto {
    private final String token;
}

