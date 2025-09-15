package com.esterodr.backend.repository;

import com.esterodr.backend.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
}
