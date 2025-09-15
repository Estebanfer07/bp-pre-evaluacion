package com.esterodr.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.service.AccountService;
import com.esterodr.backend.service.dto.CreateAccountDto;
import com.esterodr.backend.service.dto.UpdateAccountDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
public class AccountsController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody CreateAccountDto dto) {
        Account created = accountService.createAccount(dto);
        return ResponseEntity.ok(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable UUID id, @Valid @RequestBody UpdateAccountDto dto) {
        return accountService.updateAccount(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable UUID id) {
        return accountService.getAccount(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }
}
