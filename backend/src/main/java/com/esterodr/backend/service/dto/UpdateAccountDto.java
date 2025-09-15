package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.AccountType;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class UpdateAccountDto {
    private AccountType type;

    @PositiveOrZero
    private Double balance;
}
