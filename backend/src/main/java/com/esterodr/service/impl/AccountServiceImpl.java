package com.esterodr.service.impl;

import com.esterodr.domain.Account;
import com.esterodr.repository.AccountRepository;
import com.esterodr.service.AccountService;
import com.esterodr.service.dto.CreateAccountDto;
import com.esterodr.service.dto.UpdateAccountDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public Account createAccount(CreateAccountDto dto) {
        Account account = new Account();
        account.setType(dto.getType());
        account.setBalance(dto.getBalance());
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
        accountRepository.deleteById(id);
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
