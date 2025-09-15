package com.esterodr.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;
import com.esterodr.domain.enums.AccountState;
import com.esterodr.domain.enums.AccountType;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Random;

@Data
@Entity
public class Account {
    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(unique = true, nullable = false, updatable = false, length = 12)
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
    private AccountState state;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
