package com.esterodr.backend.repository;

import com.esterodr.backend.domain.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

import com.esterodr.backend.domain.enums.ClientState;
import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, UUID> {
    List<Client> findAllByState(ClientState state);

    Optional<Client> findByIdAndState(UUID id, ClientState state);
}
