package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.groups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupsRepository extends JpaRepository<groups, Long> {
    // Trouver tous les groupes d'un utilisateur
    @Query("SELECT g FROM groups g LEFT JOIN FETCH g.grids WHERE g.user.id = :userId")
    List<groups> findByUserIdWithGrids(@Param("userId") Long userId);
}
