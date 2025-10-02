package com.dawan.MesNotes.dto;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO extends BaseEntity {

    private String username;
    private String email;
}
