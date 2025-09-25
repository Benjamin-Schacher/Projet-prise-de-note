package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserRepository extends JpaRepository<User, Long > {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean findByPassword(String password);
}
