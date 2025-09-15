package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.MovementType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class CreateMovementDto {
    @NotNull
    private String accountId;

    @NotNull
    private MovementType movementType;

    @NotNull
    @PositiveOrZero
    private Double amount;

    @NotNull
    private Double balance;

    @NotNull
    private String date;
}
