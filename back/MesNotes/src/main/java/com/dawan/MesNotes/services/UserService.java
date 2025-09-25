package com.dawan.MesNotes.services;

import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.generic.GenericService;
import com.dawan.MesNotes.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService extends GenericService<User, Long, UserRepository> {
    public UserService(UserRepository repo) {
        super(repo);
    }
}
