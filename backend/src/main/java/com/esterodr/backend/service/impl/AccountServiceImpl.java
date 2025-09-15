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
import com.esterodr.backend.util.BeanUtils;

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
        BeanUtils.copyNonNullProperties(accountData, account);
        return accountRepository.save(account);
    }

    @Override
    public Optional<Account> updateAccount(UUID id, UpdateAccountDto dto) {
        return accountRepository.findById(id).map(account -> {
            BeanUtils.copyNonNullProperties(dto, account);
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
        return accountRepository.findByIdAndState(id, AccountState.ACTIVE);
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAllByState(AccountState.ACTIVE);
    }
}
