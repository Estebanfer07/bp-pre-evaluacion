package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.service.dto.CreateMovementDto;

public interface MovementFactory {

    MovementType getMovementType();

    Movements createMovement(CreateMovementDto dto, Account account);
}