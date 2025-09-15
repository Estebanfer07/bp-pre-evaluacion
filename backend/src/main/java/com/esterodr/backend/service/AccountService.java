package com.esterodr.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.service.dto.CreateAccountDto;
import com.esterodr.backend.service.dto.UpdateAccountDto;

public interface AccountService {
    Account createAccount(CreateAccountDto dto);

    Optional<Account> updateAccount(UUID id, UpdateAccountDto dto);

    void deleteAccount(UUID id);

    Optional<Account> getAccount(UUID id);

    List<Account> getAllAccounts();
}
