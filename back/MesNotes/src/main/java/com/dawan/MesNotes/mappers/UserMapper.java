package com.dawan.MesNotes.mappers;

import com.dawan.MesNotes.dto.UserDTO;
import com.dawan.MesNotes.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    UserDTO userToUserDTO(User user);
}
