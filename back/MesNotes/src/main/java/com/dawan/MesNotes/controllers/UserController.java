package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.generic.GenericController;
import com.dawan.MesNotes.services.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class UserController extends GenericController<User, Long, UserService> {

    public UserController(UserService service) {
        super(service);
    }
}
