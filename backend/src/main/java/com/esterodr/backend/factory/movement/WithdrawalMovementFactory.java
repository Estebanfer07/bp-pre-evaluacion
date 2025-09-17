package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.service.dto.CreateMovementDto;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class WithdrawalMovementFactory implements MovementFactory {

    @Override
    public MovementType getMovementType() {
        return MovementType.WITHDRAWAL;
    }

    @Override
    public Movements createMovement(CreateMovementDto dto, Account account) {
        if (account.getBalance() == 0 || account.getBalance() < dto.getAmount()) {
            log.debug("Saldo no disponible");
            throw new IllegalArgumentException("Saldo no disponible");
        }

        Movements movement = new Movements();
        movement.setAccountId(dto.getAccountId());
        movement.setMovementType(MovementType.WITHDRAWAL);
        movement.setAmount(-Math.abs(dto.getAmount()));
        movement.setBalance(account.getBalance() - dto.getAmount());
        movement.setDate(LocalDateTime.now());

        account.setBalance(movement.getBalance());

        return movement;
    }
}