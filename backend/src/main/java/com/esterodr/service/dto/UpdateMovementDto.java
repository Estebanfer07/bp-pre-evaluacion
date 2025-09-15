package com.esterodr.service.dto;

import com.esterodr.domain.enums.MovementType;
import lombok.Data;

@Data
public class UpdateMovementDto {
    private MovementType movementType;
    private Double amount;
    private Double balance;
    private String date;
}
