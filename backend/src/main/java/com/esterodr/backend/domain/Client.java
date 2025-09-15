package com.esterodr.backend.domain;

import com.esterodr.backend.domain.enums.ClientState;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "person_id")
    private Person person;

    private String password;

    @Column(name = "state")
    @Enumerated(EnumType.STRING)
    private ClientState state = ClientState.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
