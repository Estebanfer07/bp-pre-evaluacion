package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.MovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMovementDto {

    @NotNull(message = "Account ID is required")
    private UUID accountId;

    @NotNull(message = "Movement type is required")
    private MovementType movementType;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
}
