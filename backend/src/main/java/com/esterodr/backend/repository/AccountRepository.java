package com.esterodr.backend.repository;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.enums.AccountState;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    List<Account> findAllByState(AccountState state);

    Optional<Account> findByIdAndState(UUID id, AccountState state);
}
