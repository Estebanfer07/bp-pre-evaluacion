package com.esterodr.service.dto;

import com.esterodr.domain.enums.AccountType;
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
