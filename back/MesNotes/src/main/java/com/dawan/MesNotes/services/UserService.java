package com.dawan.MesNotes.services;

import com.dawan.MesNotes.dto.UserDTO;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.generic.I_GenericService;
import com.dawan.MesNotes.mappers.UserMapper;
import com.dawan.MesNotes.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService extends GenericService<User, Long, UserRepository> implements I_GenericService<User, Long> {

    public UserService(UserRepository repo, UserMapper userMapper) {
        super(repo);
        this.userMapper = userMapper;
    }

    private final UserMapper userMapper;

    @SuppressWarnings("unused")
    public UserDTO getUserDTO(User user) {
        return userMapper.userToUserDTO(user);
    }
}
