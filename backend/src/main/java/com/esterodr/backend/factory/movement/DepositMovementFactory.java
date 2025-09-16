package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.service.dto.CreateMovementDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DepositMovementFactory implements MovementFactory {

    @Override
    public MovementType getMovementType() {
        return MovementType.DEPOSIT;
    }

    @Override
    public Movements createMovement(CreateMovementDto dto, Account account) {
        Movements movement = new Movements();
        movement.setAccountId(dto.getAccountId());
        movement.setMovementType(MovementType.DEPOSIT);
        movement.setAmount(Math.abs(dto.getAmount())); // Deposits are positive
        movement.setBalance(account.getBalance() + Math.abs(dto.getAmount()));
        movement.setDate(LocalDateTime.now());

        // Update account balance
        account.setBalance(movement.getBalance());

        return movement;
    }
}