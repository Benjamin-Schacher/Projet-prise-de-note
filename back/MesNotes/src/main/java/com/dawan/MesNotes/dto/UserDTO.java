package com.dawan.MesNotes.dto;

import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class UserDTO{
    private final String username;
    private final String email;
}

