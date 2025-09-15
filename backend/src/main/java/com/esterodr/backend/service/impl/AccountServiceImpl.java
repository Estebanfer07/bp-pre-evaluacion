package com.esterodr.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.repository.AccountRepository;
import com.esterodr.backend.service.AccountService;
import com.esterodr.backend.service.dto.CreateAccountDto;
import com.esterodr.backend.service.dto.UpdateAccountDto;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountServiceImpl implements AccountService {

    AccountRepository accountRepository;

    @Override
    public Account createAccount(CreateAccountDto accountData) {
        Account account = new Account();
        account.setType(accountData.getType());
        account.setBalance(accountData.getBalance());
        return accountRepository.save(account);
    }

    @Override
    public Optional<Account> updateAccount(UUID id, UpdateAccountDto dto) {
        return accountRepository.findById(id).map(account -> {
            if (dto.getType() != null)
                account.setType(dto.getType());
            if (dto.getBalance() != null)
                account.setBalance(dto.getBalance());
            return accountRepository.save(account);
        });
    }

    @Override
    public void deleteAccount(UUID id) {
        accountRepository.findById(id).map(account -> {
            account.setState(AccountState.INACTIVE);
            return accountRepository.save(account);
        });
    }

    @Override
    public Optional<Account> getAccount(UUID id) {
        return accountRepository.findById(id);
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
}
