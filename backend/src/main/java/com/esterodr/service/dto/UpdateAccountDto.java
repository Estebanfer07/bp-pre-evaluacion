package com.esterodr.service.dto;

import com.esterodr.domain.enums.AccountType;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class UpdateAccountDto {
    private AccountType type;

    @PositiveOrZero
    private Double balance;
}
