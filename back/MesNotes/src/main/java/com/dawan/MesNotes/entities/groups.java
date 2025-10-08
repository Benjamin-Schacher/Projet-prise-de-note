package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
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

public class groups extends BaseEntity {

    @Column(nullable = false)
    private String group_name;

    //  Relation avec l'utilisateur propriétaire
    @ManyToOne
    @JoinColumn(name = "id_user") // Hibernate créera la colonne id_user
    private User user;

    @OneToMany(mappedBy = "groups", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Grid> grids = new ArrayList<>();
}

