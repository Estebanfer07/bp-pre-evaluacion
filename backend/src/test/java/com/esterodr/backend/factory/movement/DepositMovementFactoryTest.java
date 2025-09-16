package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.service.dto.CreateMovementDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class DepositMovementFactoryTest {

    private DepositMovementFactory depositMovementFactory;
    private Account testAccount;

    private static final UUID TEST_ACCOUNT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final Double TEST_INITIAL_BALANCE = 1000.0;
    private static final Double TEST_DEPOSIT_AMOUNT = 500.0;

    @BeforeEach
    void setUp() {
        depositMovementFactory = new DepositMovementFactory();
        testAccount = Account.builder()
                .id(TEST_ACCOUNT_ID)
                .accountNumber("123456789012")
                .type(AccountType.AHO)
                .balance(TEST_INITIAL_BALANCE)
                .build();
    }

    @Test
    void getMovementType_ShouldReturnDeposit() {
        assertEquals(MovementType.DEPOSIT, depositMovementFactory.getMovementType());
    }

    @Test
    void createMovement_WithPositiveAmount_ShouldCreateDepositAndUpdateBalance() {
        CreateMovementDto dto = CreateMovementDto.builder()
                .accountId(TEST_ACCOUNT_ID)
                .movementType(MovementType.DEPOSIT)
                .amount(TEST_DEPOSIT_AMOUNT)
                .build();

        Movements movement = depositMovementFactory.createMovement(dto, testAccount);

        assertEquals(TEST_ACCOUNT_ID, movement.getAccountId());
        assertEquals(MovementType.DEPOSIT, movement.getMovementType());
        assertEquals(TEST_DEPOSIT_AMOUNT, movement.getAmount());
        assertEquals(1500.0, movement.getBalance());
        assertEquals(1500.0, testAccount.getBalance());
        assertNotNull(movement.getDate());
    }

    @Test
    void createMovement_WithNegativeAmount_ShouldUseAbsoluteValue() {
        CreateMovementDto dto = CreateMovementDto.builder()
                .accountId(TEST_ACCOUNT_ID)
                .movementType(MovementType.DEPOSIT)
                .amount(-300.0)
                .build();

        Movements movement = depositMovementFactory.createMovement(dto, testAccount);

        assertEquals(300.0, movement.getAmount());
        assertEquals(1300.0, movement.getBalance());
        assertEquals(1300.0, testAccount.getBalance());
    }
}