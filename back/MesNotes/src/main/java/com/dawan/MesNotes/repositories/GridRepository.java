package com.dawan.MesNotes.repositories;

import com.dawan.MesNotes.entities.Grid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GridRepository extends JpaRepository<Grid, Long> {
    List<Grid> findByGroupsId(Long id);
}
