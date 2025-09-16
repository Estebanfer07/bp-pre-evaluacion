package com.esterodr.backend.service.dto;

import java.util.UUID;

import com.esterodr.backend.domain.enums.AccountType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountDto {
    @NotNull
    private AccountType type;

    @NotNull
    @PositiveOrZero
    private Double balance;

    @NotNull
    private UUID clientId;
}
