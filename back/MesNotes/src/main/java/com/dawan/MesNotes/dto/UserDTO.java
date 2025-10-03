package com.dawan.MesNotes.dto;

import lombok.*;

@Getter
@AllArgsConstructor
public class UserDTO{
    private final String username;
    private final String email;
    private final String password;
}

