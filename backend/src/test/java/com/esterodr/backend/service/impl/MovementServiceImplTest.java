package com.esterodr.backend.service.impl;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.factory.movement.MovementFactory;
import com.esterodr.backend.factory.movement.MovementFactoryProvider;
import com.esterodr.backend.repository.AccountRepository;
import com.esterodr.backend.repository.MovementRepository;
import com.esterodr.backend.service.ReportService;
import com.esterodr.backend.service.dto.CreateMovementDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovementServiceImplTest {

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private MovementFactoryProvider movementFactoryProvider;

    @Mock
    private MovementFactory movementFactory;

    @Mock
    private ReportService reportService;

    @InjectMocks
    private MovementServiceImpl movementService;

    private static final UUID TEST_MOVEMENT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID TEST_MOVEMENT_ID_2 = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID TEST_ACCOUNT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID TEST_CLIENT_ID = UUID.fromString("44444444-4444-4444-4444-444444444444");
    private static final String TEST_ACCOUNT_NUMBER = "123456789012";
    private static final Double TEST_AMOUNT = 500.0;
    private static final Double TEST_BALANCE_BEFORE = 1000.0;
    private static final Double TEST_BALANCE_AFTER_DEPOSIT = 1500.0;
    private static final Double TEST_BALANCE_AFTER_WITHDRAWAL = 500.0;
    private static final MovementType TEST_MOVEMENT_TYPE_DEPOSIT = MovementType.DEPOSIT;
    private static final MovementType TEST_MOVEMENT_TYPE_WITHDRAWAL = MovementType.WITHDRAWAL;
    private static final ReportFormat TEST_REPORT_FORMAT_JSON = ReportFormat.JSON;
    private static final LocalDate TEST_FROM_DATE = LocalDate.of(2025, 9, 1);
    private static final LocalDate TEST_TO_DATE = LocalDate.of(2025, 9, 30);
    private static final LocalDateTime TEST_MOVEMENT_DATE = LocalDateTime.of(2025, 9, 16, 10, 30);
    private static final String TEST_ACCOUNT_ID_ALL = "all";
    private static final String TEST_INVALID_ACCOUNT_ID = "invalid-uuid";
    private static final String TEST_REPORT_RESPONSE = "{\"report\": \"movements\"}";

    private Account testAccount;
    private Movements testMovement;
    private Movements testMovement2;
    private CreateMovementDto createMovementDto;

    @BeforeEach
    void setUp() {
        testAccount = Account.builder()
                .id(TEST_ACCOUNT_ID)
                .accountNumber(TEST_ACCOUNT_NUMBER)
                .type(AccountType.AHO)
                .state(AccountState.ACTIVE)
                .balance(TEST_BALANCE_BEFORE)
                .clientId(TEST_CLIENT_ID)
                .build();

        testMovement = Movements.builder()
                .id(TEST_MOVEMENT_ID)
                .accountId(TEST_ACCOUNT_ID)
                .account(testAccount)
                .date(TEST_MOVEMENT_DATE)
                .movementType(TEST_MOVEMENT_TYPE_DEPOSIT)
                .amount(TEST_AMOUNT)
                .balance(TEST_BALANCE_AFTER_DEPOSIT)
                .isReversed(false)
                .build();

        testMovement2 = Movements.builder()
                .id(TEST_MOVEMENT_ID_2)
                .accountId(TEST_ACCOUNT_ID)
                .account(testAccount)
                .date(TEST_MOVEMENT_DATE.minusDays(1))
                .movementType(TEST_MOVEMENT_TYPE_WITHDRAWAL)
                .amount(TEST_AMOUNT)
                .balance(TEST_BALANCE_AFTER_WITHDRAWAL)
                .isReversed(false)
                .build();

        createMovementDto = CreateMovementDto.builder()
                .accountId(TEST_ACCOUNT_ID)
                .movementType(TEST_MOVEMENT_TYPE_DEPOSIT)
                .amount(TEST_AMOUNT)
                .build();
    }

    @Test
    void createMovement_ShouldCreateMovementSuccessfully() {

        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(movementFactoryProvider.getFactory(TEST_MOVEMENT_TYPE_DEPOSIT)).thenReturn(movementFactory);
        when(movementFactory.createMovement(createMovementDto, testAccount)).thenReturn(testMovement);
        when(movementRepository.save(testMovement)).thenReturn(testMovement);
        when(accountRepository.save(testAccount)).thenReturn(testAccount);

        Movements result = movementService.createMovement(createMovementDto);

        assertNotNull(result);
        assertEquals(testMovement.getId(), result.getId());
        assertEquals(testMovement.getAmount(), result.getAmount());
        assertEquals(testMovement.getMovementType(), result.getMovementType());

        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(movementFactoryProvider).getFactory(TEST_MOVEMENT_TYPE_DEPOSIT);
        verify(movementFactory).createMovement(createMovementDto, testAccount);
        verify(accountRepository).save(testAccount);
        verify(movementRepository).save(testMovement);
    }

    @Test
    void createMovement_WithInvalidAccount_ShouldThrowException() {

        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> movementService.createMovement(createMovementDto));

        assertEquals("Account not found", exception.getMessage());
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(movementFactoryProvider, never()).getFactory(any());
        verify(movementRepository, never()).save(any());
    }

    @Test
    void deleteMovement_WithValidId_ShouldReverseMovement() {

        when(movementRepository.findByIdAndIsReversedFalse(TEST_MOVEMENT_ID))
                .thenReturn(Optional.of(testMovement));
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);
        when(movementRepository.save(any(Movements.class))).thenReturn(testMovement);

        movementService.deleteMovement(TEST_MOVEMENT_ID);

        verify(movementRepository).findByIdAndIsReversedFalse(TEST_MOVEMENT_ID);
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(accountRepository)
                .save(argThat(account -> account.getBalance().equals(TEST_BALANCE_BEFORE - TEST_AMOUNT)));
        verify(movementRepository).save(argThat(movement -> movement.isReversed()));
    }

    @Test
    void deleteMovement_WithWithdrawalType_ShouldReverseCorrectly() {

        Movements withdrawalMovement = Movements.builder()
                .id(TEST_MOVEMENT_ID)
                .accountId(TEST_ACCOUNT_ID)
                .movementType(TEST_MOVEMENT_TYPE_WITHDRAWAL)
                .amount(TEST_AMOUNT)
                .isReversed(false)
                .build();

        when(movementRepository.findByIdAndIsReversedFalse(TEST_MOVEMENT_ID))
                .thenReturn(Optional.of(withdrawalMovement));
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);
        when(movementRepository.save(any(Movements.class))).thenReturn(withdrawalMovement);

        movementService.deleteMovement(TEST_MOVEMENT_ID);

        verify(movementRepository).findByIdAndIsReversedFalse(TEST_MOVEMENT_ID);
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(accountRepository)
                .save(argThat(account -> account.getBalance().equals(TEST_BALANCE_BEFORE + TEST_AMOUNT)));

        verify(movementRepository).save(argThat(movement -> movement.isReversed()));
    }

    @Test
    void deleteMovement_WithInvalidId_ShouldDoNothing() {

        when(movementRepository.findByIdAndIsReversedFalse(TEST_MOVEMENT_ID))
                .thenReturn(Optional.empty());

        movementService.deleteMovement(TEST_MOVEMENT_ID);

        verify(movementRepository).findByIdAndIsReversedFalse(TEST_MOVEMENT_ID);
        verify(accountRepository, never()).findById(any());
        verify(accountRepository, never()).save(any());
        verify(movementRepository, never()).save(any());
    }

    @Test
    void getMovement_WithValidId_ShouldReturnMovement() {

        when(movementRepository.findByIdAndIsReversedFalse(TEST_MOVEMENT_ID))
                .thenReturn(Optional.of(testMovement));

        Optional<Movements> result = movementService.getMovement(TEST_MOVEMENT_ID);

        assertTrue(result.isPresent());
        assertEquals(testMovement.getId(), result.get().getId());
        assertEquals(testMovement.getAmount(), result.get().getAmount());
        verify(movementRepository).findByIdAndIsReversedFalse(TEST_MOVEMENT_ID);
    }

    @Test
    void getMovement_WithInvalidId_ShouldReturnEmpty() {

        when(movementRepository.findByIdAndIsReversedFalse(TEST_MOVEMENT_ID))
                .thenReturn(Optional.empty());

        Optional<Movements> result = movementService.getMovement(TEST_MOVEMENT_ID);

        assertFalse(result.isPresent());
        verify(movementRepository).findByIdAndIsReversedFalse(TEST_MOVEMENT_ID);
    }

    @Test
    void generateMovementsReport_WithSpecificAccount_ShouldReturnReport() {

        List<Movements> movements = Arrays.asList(testMovement, testMovement2);
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(movementRepository.findByAccountIdAndDateRangeAndIsReversedFalseWithClient(
                eq(TEST_ACCOUNT_ID), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(movements);
        when(reportService.generateMovementsReport(
                eq(TEST_REPORT_FORMAT_JSON), eq(movements), eq(testAccount),
                eq(TEST_FROM_DATE), eq(TEST_TO_DATE)))
                .thenReturn(TEST_REPORT_RESPONSE);

        Object result = movementService.generateMovementsReport(
                TEST_ACCOUNT_ID.toString(), TEST_REPORT_FORMAT_JSON, TEST_FROM_DATE, TEST_TO_DATE);

        assertNotNull(result);
        assertEquals(TEST_REPORT_RESPONSE, result);
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(movementRepository).findByAccountIdAndDateRangeAndIsReversedFalseWithClient(
                eq(TEST_ACCOUNT_ID), any(LocalDateTime.class), any(LocalDateTime.class));
        verify(reportService).generateMovementsReport(
                eq(TEST_REPORT_FORMAT_JSON), eq(movements), eq(testAccount),
                eq(TEST_FROM_DATE), eq(TEST_TO_DATE));
    }

    @Test
    void generateMovementsReport_WithAllAccounts_ShouldReturnReport() {

        List<Movements> movements = Arrays.asList(testMovement, testMovement2);
        when(movementRepository.findAllByDateRangeAndIsReversedFalseWithClient(
                any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(movements);
        when(reportService.generateMovementsReport(
                eq(TEST_REPORT_FORMAT_JSON), eq(movements), eq(null),
                eq(TEST_FROM_DATE), eq(TEST_TO_DATE)))
                .thenReturn(TEST_REPORT_RESPONSE);

        Object result = movementService.generateMovementsReport(
                TEST_ACCOUNT_ID_ALL, TEST_REPORT_FORMAT_JSON, TEST_FROM_DATE, TEST_TO_DATE);

        assertNotNull(result);
        assertEquals(TEST_REPORT_RESPONSE, result);
        verify(accountRepository, never()).findById(any());
        verify(movementRepository).findAllByDateRangeAndIsReversedFalseWithClient(
                any(LocalDateTime.class), any(LocalDateTime.class));
        verify(reportService).generateMovementsReport(
                eq(TEST_REPORT_FORMAT_JSON), eq(movements), eq(null),
                eq(TEST_FROM_DATE), eq(TEST_TO_DATE));
    }

    @Test
    void generateMovementsReport_WithNullDates_ShouldUseCurrentMonth() {

        List<Movements> movements = Arrays.asList(testMovement);
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(movementRepository.findByAccountIdAndDateRangeAndIsReversedFalseWithClient(
                eq(TEST_ACCOUNT_ID), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(movements);
        when(reportService.generateMovementsReport(
                eq(TEST_REPORT_FORMAT_JSON), eq(movements), eq(testAccount),
                any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(TEST_REPORT_RESPONSE);

        Object result = movementService.generateMovementsReport(
                TEST_ACCOUNT_ID.toString(), TEST_REPORT_FORMAT_JSON, null, null);

        assertNotNull(result);
        assertEquals(TEST_REPORT_RESPONSE, result);
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(movementRepository).findByAccountIdAndDateRangeAndIsReversedFalseWithClient(
                eq(TEST_ACCOUNT_ID), any(LocalDateTime.class), any(LocalDateTime.class));
        verify(reportService).generateMovementsReport(
                eq(TEST_REPORT_FORMAT_JSON), eq(movements), eq(testAccount),
                any(LocalDate.class), any(LocalDate.class));
    }

    @Test
    void generateMovementsReport_WithInvalidAccountId_ShouldThrowException() {

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> movementService.generateMovementsReport(
                        TEST_INVALID_ACCOUNT_ID, TEST_REPORT_FORMAT_JSON, TEST_FROM_DATE, TEST_TO_DATE));

        assertEquals("Invalid account ID format: " + TEST_INVALID_ACCOUNT_ID, exception.getMessage());
        verify(accountRepository, never()).findById(any());
        verify(movementRepository, never()).findByAccountIdAndDateRangeAndIsReversedFalseWithClient(
                any(), any(), any());
    }

    @Test
    void generateMovementsReport_WithNonExistentAccount_ShouldThrowException() {

        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> movementService.generateMovementsReport(
                        TEST_ACCOUNT_ID.toString(), TEST_REPORT_FORMAT_JSON, TEST_FROM_DATE, TEST_TO_DATE));

        assertEquals("Account not found", exception.getMessage());
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(movementRepository, never()).findByAccountIdAndDateRangeAndIsReversedFalseWithClient(
                any(), any(), any());
    }
}