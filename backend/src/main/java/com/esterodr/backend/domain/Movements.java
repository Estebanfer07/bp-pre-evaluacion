package com.esterodr.backend.domain;

import com.esterodr.backend.domain.enums.MovementType;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "movements")
public class Movements {
    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", insertable = false, updatable = false)
    @JsonBackReference
    private Account account;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private MovementType movementType;

    private Double amount;
    private Double balance;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "is_reversed", nullable = false)
    private boolean isReversed = false;
}
