package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString

public class Grid extends BaseEntity {


    private int grid_L;
    private  int grid_H;

    @Column(nullable = false)
    private String grid_name;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonBackReference
    private groups groups; // doit correspondre à mappedBy

    @OneToMany(mappedBy = "grid", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // sérialisation "parent"
    private List<Note> notes = new ArrayList<>();

}
