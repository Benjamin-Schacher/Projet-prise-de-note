package com.dawan.MesNotes.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serial;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "authorities")
public class Authority implements GrantedAuthority {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @Column(length = 30)
    private String authority;

    @Override
    public String getAuthority() {
        return authority;
    }
}

