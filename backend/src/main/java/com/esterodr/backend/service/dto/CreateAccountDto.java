package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.AccountType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class CreateAccountDto {
    @NotNull
    private AccountType type;

    @NotNull
    @PositiveOrZero
    private Double balance;
}
