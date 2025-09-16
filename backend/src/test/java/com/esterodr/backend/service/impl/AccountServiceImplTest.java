package com.esterodr.backend.service.impl;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.repository.AccountRepository;
import com.esterodr.backend.service.dto.CreateAccountDto;
import com.esterodr.backend.service.dto.UpdateAccountDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    private static final UUID TEST_ACCOUNT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID TEST_ACCOUNT_ID_2 = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID TEST_CLIENT_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final String TEST_ACCOUNT_NUMBER = "123456789012";
    private static final String TEST_ACCOUNT_NUMBER_2 = "987654321098";
    private static final double TEST_BALANCE = 1000.0;
    private static final double TEST_BALANCE_2 = 2000.0;
    private static final double UPDATED_BALANCE = 1500.0;
    private static final AccountType TEST_ACCOUNT_TYPE = AccountType.AHO;
    private static final AccountType TEST_ACCOUNT_TYPE_2 = AccountType.CTE;
    private static final AccountState TEST_ACCOUNT_STATE = AccountState.ACTIVE;

    private Account testAccount;
    private CreateAccountDto createAccountDto;
    private UpdateAccountDto updateAccountDto;

    @BeforeEach
    void setUp() {
        testAccount = Account.builder()
                .id(TEST_ACCOUNT_ID)
                .accountNumber(TEST_ACCOUNT_NUMBER)
                .type(TEST_ACCOUNT_TYPE)
                .state(TEST_ACCOUNT_STATE)
                .balance(TEST_BALANCE)
                .clientId(TEST_CLIENT_ID)
                .build();

        createAccountDto = CreateAccountDto.builder()
                .type(TEST_ACCOUNT_TYPE)
                .balance(TEST_BALANCE)
                .clientId(TEST_CLIENT_ID)
                .build();

        updateAccountDto = UpdateAccountDto.builder()
                .balance(UPDATED_BALANCE)
                .build();
    }

    @Test
    void createAccount_ShouldCreateAndReturnAccount() {
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.createAccount(createAccountDto);

        assertNotNull(result);
        assertEquals(TEST_ACCOUNT_NUMBER, result.getAccountNumber());
        assertEquals(TEST_ACCOUNT_TYPE, result.getType());
        assertEquals(TEST_BALANCE, result.getBalance());
        verify(accountRepository).save(any(Account.class));
    }

    @Test
    void updateAccount_WithValidId_ShouldUpdateAndReturnAccount() {
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Optional<Account> result = accountService.updateAccount(TEST_ACCOUNT_ID, updateAccountDto);

        assertTrue(result.isPresent());
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(accountRepository).save(any(Account.class));
    }

    @Test
    void updateAccount_WithInvalidId_ShouldReturnEmpty() {
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.empty());

        Optional<Account> result = accountService.updateAccount(TEST_ACCOUNT_ID, updateAccountDto);

        assertFalse(result.isPresent());
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(accountRepository, never()).save(any(Account.class));
    }

    @Test
    void deleteAccount_ShouldSetStateToInactive() {
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        accountService.deleteAccount(TEST_ACCOUNT_ID);

        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(accountRepository).save(argThat(account -> account.getState() == AccountState.INACTIVE));
    }

    @Test
    void deleteAccount_WithInvalidId_ShouldNotThrowException() {
        when(accountRepository.findById(TEST_ACCOUNT_ID)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> accountService.deleteAccount(TEST_ACCOUNT_ID));
        verify(accountRepository).findById(TEST_ACCOUNT_ID);
        verify(accountRepository, never()).save(any(Account.class));
    }

    @Test
    void getAccount_WithValidId_ShouldReturnAccount() {
        when(accountRepository.findByIdAndState(TEST_ACCOUNT_ID, TEST_ACCOUNT_STATE))
                .thenReturn(Optional.of(testAccount));

        Optional<Account> result = accountService.getAccount(TEST_ACCOUNT_ID);

        assertTrue(result.isPresent());
        assertEquals(testAccount, result.get());
        verify(accountRepository).findByIdAndState(TEST_ACCOUNT_ID, TEST_ACCOUNT_STATE);
    }

    @Test
    void getAccount_WithInvalidId_ShouldReturnEmpty() {
        when(accountRepository.findByIdAndState(TEST_ACCOUNT_ID, TEST_ACCOUNT_STATE))
                .thenReturn(Optional.empty());

        Optional<Account> result = accountService.getAccount(TEST_ACCOUNT_ID);

        assertFalse(result.isPresent());
        verify(accountRepository).findByIdAndState(TEST_ACCOUNT_ID, TEST_ACCOUNT_STATE);
    }

    @Test
    void getAllAccounts_ShouldReturnListOfActiveAccounts() {
        Account account2 = Account.builder()
                .id(TEST_ACCOUNT_ID_2)
                .accountNumber(TEST_ACCOUNT_NUMBER_2)
                .type(TEST_ACCOUNT_TYPE_2)
                .state(TEST_ACCOUNT_STATE)
                .balance(TEST_BALANCE_2)
                .clientId(TEST_CLIENT_ID)
                .build();

        List<Account> expectedAccounts = Arrays.asList(testAccount, account2);
        when(accountRepository.findAllByState(TEST_ACCOUNT_STATE)).thenReturn(expectedAccounts);

        List<Account> result = accountService.getAllAccounts();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedAccounts, result);
        verify(accountRepository).findAllByState(TEST_ACCOUNT_STATE);
    }

    @Test
    void getAllAccounts_WhenNoActiveAccounts_ShouldReturnEmptyList() {
        when(accountRepository.findAllByState(TEST_ACCOUNT_STATE)).thenReturn(List.of());

        List<Account> result = accountService.getAllAccounts();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(accountRepository).findAllByState(TEST_ACCOUNT_STATE);
    }
}