package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface UserRepository extends JpaRepository<User, Long > {
}
