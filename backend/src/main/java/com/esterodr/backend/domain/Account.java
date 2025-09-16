package com.esterodr.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Random;

@Data
@Entity
@Table(name = "accounts")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    @JsonBackReference
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

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private AccountState state = AccountState.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Movements> movements;
}
