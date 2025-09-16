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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class AccountServiceImpl implements AccountService {

    AccountRepository accountRepository;

    @Override
    public Account createAccount(CreateAccountDto accountData) {
        log.info("Creating new account for clientId: {}", accountData.getClientId());
        Account account = new Account();
        BeanUtils.copyNonNullProperties(accountData, account);
        Account savedAccount = accountRepository.save(account);
        log.info("Account created successfully with ID: {} and account number: {}",
                savedAccount.getId(), savedAccount.getAccountNumber());
        return savedAccount;
    }

    @Override
    public Optional<Account> updateAccount(UUID id, UpdateAccountDto dto) {
        log.info("Updating account with ID: {}", id);
        return accountRepository.findById(id).map(account -> {
            log.debug("Account found, applying updates: {}", dto);
            BeanUtils.copyNonNullProperties(dto, account);
            Account updatedAccount = accountRepository.save(account);
            log.info("Account updated successfully: {}", updatedAccount.getId());
            return updatedAccount;
        }).or(() -> {
            log.warn("Account not found for update with ID: {}", id);
            return Optional.empty();
        });
    }

    @Override
    public void deleteAccount(UUID id) {
        log.info("Soft deleting account with ID: {}", id);
        accountRepository.findById(id).map(account -> {
            account.setState(AccountState.INACTIVE);
            Account savedAccount = accountRepository.save(account);
            log.info("Account soft deleted successfully: {}", savedAccount.getId());
            return savedAccount;
        }).orElseGet(() -> {
            log.warn("Account not found for deletion with ID: {}", id);
            return null;
        });
    }

    @Override
    public Optional<Account> getAccount(UUID id) {
        log.debug("Retrieving active account with ID: {}", id);
        Optional<Account> account = accountRepository.findByIdAndState(id, AccountState.ACTIVE);
        if (account.isPresent()) {
            log.debug("Account found: {}", account.get().getAccountNumber());
        } else {
            log.debug("No active account found with ID: {}", id);
        }
        return account;
    }

    @Override
    public List<Account> getAllAccounts() {
        log.info("Retrieving all active accounts");
        List<Account> accounts = accountRepository.findAllByState(AccountState.ACTIVE);
        log.info("Found {} active accounts", accounts.size());
        return accounts;
    }
}
