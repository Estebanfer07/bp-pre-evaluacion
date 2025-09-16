package com.esterodr.backend.controller;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.service.AccountService;
import com.esterodr.backend.service.dto.CreateAccountDto;
import com.esterodr.backend.service.dto.UpdateAccountDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountsController.class)
class AccountsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AccountService accountService;

    @Autowired
    private ObjectMapper objectMapper;

    private static final UUID TEST_ACCOUNT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
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
    void createAccount_WithValidData_ShouldReturnCreatedAccount() throws Exception {
        when(accountService.createAccount(any(CreateAccountDto.class))).thenReturn(testAccount);

        mockMvc.perform(post("/api/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createAccountDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(TEST_ACCOUNT_ID.toString()))
                .andExpect(jsonPath("$.accountNumber").value(TEST_ACCOUNT_NUMBER))
                .andExpect(jsonPath("$.type").value(TEST_ACCOUNT_TYPE.name()))
                .andExpect(jsonPath("$.balance").value(TEST_BALANCE))
                .andExpect(jsonPath("$.state").value(TEST_ACCOUNT_STATE.name()));
    }

    @Test
    void updateAccount_WithValidId_ShouldReturnUpdatedAccount() throws Exception {
        Account updatedAccount = Account.builder()
                .id(TEST_ACCOUNT_ID)
                .accountNumber(TEST_ACCOUNT_NUMBER)
                .type(TEST_ACCOUNT_TYPE)
                .state(TEST_ACCOUNT_STATE)
                .balance(UPDATED_BALANCE)
                .clientId(TEST_CLIENT_ID)
                .build();

        when(accountService.updateAccount(eq(TEST_ACCOUNT_ID), any(UpdateAccountDto.class)))
                .thenReturn(Optional.of(updatedAccount));

        mockMvc.perform(patch("/api/accounts/{id}", TEST_ACCOUNT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateAccountDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(TEST_ACCOUNT_ID.toString()))
                .andExpect(jsonPath("$.balance").value(UPDATED_BALANCE));
    }

    @Test
    void getAccount_WithValidId_ShouldReturnAccount() throws Exception {
        when(accountService.getAccount(TEST_ACCOUNT_ID)).thenReturn(Optional.of(testAccount));

        mockMvc.perform(get("/api/accounts/{id}", TEST_ACCOUNT_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(TEST_ACCOUNT_ID.toString()))
                .andExpect(jsonPath("$.accountNumber").value(TEST_ACCOUNT_NUMBER))
                .andExpect(jsonPath("$.type").value(TEST_ACCOUNT_TYPE.name()))
                .andExpect(jsonPath("$.balance").value(TEST_BALANCE));
    }

    @Test
    void getAllAccounts_ShouldReturnListOfAccounts() throws Exception {
        Account account2 = Account.builder()
                .id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
                .accountNumber(TEST_ACCOUNT_NUMBER_2)
                .type(TEST_ACCOUNT_TYPE_2)
                .state(TEST_ACCOUNT_STATE)
                .balance(TEST_BALANCE_2)
                .build();

        List<Account> accounts = Arrays.asList(testAccount, account2);
        when(accountService.getAllAccounts()).thenReturn(accounts);

        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void deleteAccount_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(accountService).deleteAccount(TEST_ACCOUNT_ID);

        mockMvc.perform(delete("/api/accounts/{id}", TEST_ACCOUNT_ID))
                .andExpect(status().isNoContent());
    }
}