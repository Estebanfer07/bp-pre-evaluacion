package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.AccountType;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountDto {
    private AccountType type;

    @PositiveOrZero
    private Double balance;
}
