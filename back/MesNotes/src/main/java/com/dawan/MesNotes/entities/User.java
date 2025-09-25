package com.dawan.MesNotes.entities;

import com.dawan.MesNotes.entities.heritage.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User extends BaseEntity {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    @ElementCollection
    @JsonIgnore
    private List<Note> notes;
}
