package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.MovementType;

import lombok.Data;

@Data
public class UpdateMovementDto {
    private MovementType movementType;
    private Double amount;
    private Double balance;
    private String date;
}
