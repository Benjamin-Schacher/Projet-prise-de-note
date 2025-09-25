package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
