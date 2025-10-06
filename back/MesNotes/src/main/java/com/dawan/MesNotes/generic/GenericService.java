package com.dawan.MesNotes.generic;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@RequiredArgsConstructor
public class GenericService < E, // entity
                              I, // id
                              R extends JpaRepository< E, I> // repository
                            > implements I_GenericService<E, I>{
    protected final R repo;

    @Override
    public Page<E> all(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public Optional<E> byId(I id) {
        return repo.findById(id);
    }

    @Override
    public void deleteById(I id) {
        repo.deleteById(id);
    }

    @Override
    public E saveOrUpdate(E entity) {
        return repo.save(entity);
    }
}
