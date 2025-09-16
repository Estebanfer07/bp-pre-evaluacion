package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.service.dto.CreateMovementDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TransferMovementFactory implements MovementFactory {

    @Override
    public MovementType getMovementType() {
        return MovementType.TRANSFER;
    }

    @Override
    public Movements createMovement(CreateMovementDto dto, Account account) {
        if (account.getBalance() == 0 || account.getBalance() < dto.getAmount()) {
            throw new IllegalArgumentException("Saldo no disponible");
        }

        Movements movement = new Movements();
        movement.setAccountId(dto.getAccountId());
        movement.setMovementType(MovementType.TRANSFER);
        movement.setAmount(-Math.abs(dto.getAmount())); // Transfers are negative (outgoing)
        movement.setBalance(account.getBalance() - dto.getAmount());
        movement.setDate(LocalDateTime.now());

        // Update account balance
        account.setBalance(movement.getBalance());

        return movement;
    }
}