package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

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

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_groups", nullable = false)
    private groups groups;

}
