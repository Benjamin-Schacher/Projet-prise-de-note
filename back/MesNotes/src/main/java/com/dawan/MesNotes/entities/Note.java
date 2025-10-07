package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Note extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Lob
    private String content;

    private LocalDateTime date;

    @Column(precision = 15, scale = 2)
    private BigDecimal pos_x;

    @Column(precision = 15, scale = 2)
    private BigDecimal pos_y;

    @Column(nullable = false)
    private boolean is_grid;

    @ManyToOne
    @JoinColumn(name = "grid_id")
    private  Grid grid;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
