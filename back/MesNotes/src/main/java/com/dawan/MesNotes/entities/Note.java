package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Note extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(nullable = false)
    private String title;

    @Lob
    private String content;

    private LocalDateTime date;

    private int pos_x;

    private int pos_y;

    @Column(nullable = false,name = "is_grid")
    private boolean is_grid;

    @ManyToOne
    @JoinColumn(name = "grid_id")
    @JsonBackReference // sérialisation "enfant"
    private Grid grid;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonProperty("grid_id")
    public Long getGridId() {
        return grid != null ? grid.getId() : null;
    }
}
