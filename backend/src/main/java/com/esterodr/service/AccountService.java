package com.esterodr.service;

import com.esterodr.domain.Account;
import com.esterodr.service.dto.CreateAccountDto;
import com.esterodr.service.dto.UpdateAccountDto;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountService {
    Account createAccount(CreateAccountDto dto);

    Optional<Account> updateAccount(UUID id, UpdateAccountDto dto);

    void deleteAccount(UUID id);

    Optional<Account> getAccount(UUID id);

    List<Account> getAllAccounts();
}
