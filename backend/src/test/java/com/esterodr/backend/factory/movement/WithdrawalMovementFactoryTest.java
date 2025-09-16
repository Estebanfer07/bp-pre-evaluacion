package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Client;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.Person;
import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.domain.enums.ClientState;
import com.esterodr.backend.domain.enums.Gender;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.service.dto.CreateMovementDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class WithdrawalMovementFactoryTest {

    private WithdrawalMovementFactory withdrawalMovementFactory;
    private Account testAccount;
    private CreateMovementDto testCreateMovementDto;

    @BeforeEach
    void setUp() {
        withdrawalMovementFactory = new WithdrawalMovementFactory();

        Person testPerson = Person.builder()
                .id(UUID.randomUUID())
                .name("John Doe")
                .identification("1234567890")
                .address("123 Test Street")
                .phone("555-0123")
                .gender(Gender.MALE)
                .age(30)
                .build();

        Client testClient = Client.builder()
                .id(UUID.randomUUID())
                .password("password")
                .state(ClientState.ACTIVE)
                .person(testPerson)
                .build();

        testAccount = Account.builder()
                .id(UUID.randomUUID())
                .accountNumber("123456789012")
                .type(AccountType.AHO)
                .balance(1000.0)
                .state(AccountState.ACTIVE)
                .client(testClient)
                .build();

        testCreateMovementDto = CreateMovementDto.builder()
                .accountId(testAccount.getId())
                .movementType(MovementType.WITHDRAWAL)
                .amount(300.0)
                .build();
    }

    @Test
    void getMovementType_ShouldReturnWithdrawal() {
        MovementType movementType = withdrawalMovementFactory.getMovementType();
        assertEquals(MovementType.WITHDRAWAL, movementType);
    }

    @Test
    void createMovement_ShouldCreateWithdrawalMovement() {
        Movements movement = withdrawalMovementFactory.createMovement(testCreateMovementDto, testAccount);

        assertNotNull(movement);
        assertEquals(testAccount.getId(), movement.getAccountId());
        assertEquals(MovementType.WITHDRAWAL, movement.getMovementType());
        assertEquals(-300.0, movement.getAmount());
        assertEquals(700.0, movement.getBalance());
        assertNotNull(movement.getDate());
        assertTrue(movement.getDate().isBefore(LocalDateTime.now().plusSeconds(1)));

        assertEquals(700.0, testAccount.getBalance());
    }

    @Test
    void createMovement_WithInsufficientFunds_ShouldThrowException() {
        testCreateMovementDto = CreateMovementDto.builder()
                .accountId(testAccount.getId())
                .movementType(MovementType.WITHDRAWAL)
                .amount(1500.0)
                .build();

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> withdrawalMovementFactory.createMovement(testCreateMovementDto, testAccount));

        assertEquals("Saldo no disponible", exception.getMessage());
        assertEquals(1000.0, testAccount.getBalance());
    }

    @Test
    void createMovement_WithExactBalanceAmount_ShouldCreateMovement() {
        testCreateMovementDto = CreateMovementDto.builder()
                .accountId(testAccount.getId())
                .movementType(MovementType.WITHDRAWAL)
                .amount(1000.0)
                .build();

        Movements movement = withdrawalMovementFactory.createMovement(testCreateMovementDto, testAccount);

        assertNotNull(movement);
        assertEquals(testAccount.getId(), movement.getAccountId());
        assertEquals(MovementType.WITHDRAWAL, movement.getMovementType());
        assertEquals(-1000.0, movement.getAmount());
        assertEquals(0.0, movement.getBalance());
        assertNotNull(movement.getDate());

        assertEquals(0.0, testAccount.getBalance());
    }
}