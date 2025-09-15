package com.esterodr.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Random;

@Data
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(name = "account_number", length = 12)
    private String accountNumber;

    @PrePersist
    public void generateAccountNumber() {
        if (this.accountNumber == null) {
            this.accountNumber = String.format("%012d", Math.abs(new Random().nextLong()) % 1_000_000_000_000L);
        }
    }

    @Enumerated(EnumType.STRING)
    private AccountType type;

    private Double balance;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private AccountState state = AccountState.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
