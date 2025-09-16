package com.esterodr.backend.service.impl;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.factory.movement.MovementFactoryProvider;
import com.esterodr.backend.repository.AccountRepository;
import com.esterodr.backend.repository.MovementRepository;
import com.esterodr.backend.service.MovementService;
import com.esterodr.backend.service.ReportService;
import com.esterodr.backend.service.dto.CreateMovementDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MovementServiceImpl implements MovementService {

    MovementRepository movementRepository;
    AccountRepository accountRepository;
    MovementFactoryProvider movementFactoryProvider;
    ReportService reportService;

    @Override
    @Transactional
    public Movements createMovement(CreateMovementDto movementData) {
        log.info("Creating movement for account {} with type {} and amount {}",
                movementData.getAccountId(), movementData.getMovementType(), movementData.getAmount());

        Account account = accountRepository.findById(movementData.getAccountId())
                .orElseThrow(() -> {
                    log.error("Account not found with ID: {}", movementData.getAccountId());
                    return new IllegalArgumentException("Account not found");
                });

        log.debug("Found account {} with current balance: {}", account.getId(), account.getBalance());

        var factory = movementFactoryProvider.getFactory(movementData.getMovementType());
        log.debug("Using factory for movement type: {}", movementData.getMovementType());

        Movements movement = factory.createMovement(movementData, account);
        log.debug("Created movement with new account balance: {}", account.getBalance());

        accountRepository.save(account);
        Movements savedMovement = movementRepository.save(movement);

        log.info("Successfully created movement with ID {} for account {}",
                savedMovement.getId(), savedMovement.getAccountId());

        return savedMovement;
    }

    @Override
    public void deleteMovement(UUID id) {
        log.info("Attempting to reverse movement with ID: {}", id);

        movementRepository.findByIdAndIsReversedFalse(id)
                .ifPresentOrElse(movement -> {
                    log.debug("Found movement {} of type {} with amount {} for reversal",
                            movement.getId(), movement.getMovementType(), movement.getAmount());

                    movement.setReversed(true);
                    Account account = accountRepository.findById(movement.getAccountId())
                            .orElseThrow(() -> {
                                log.error("Account not found for movement reversal: {}", movement.getAccountId());
                                return new IllegalArgumentException("Account not found for movement reversal");
                            });

                    log.debug("Current account balance before reversal: {}", account.getBalance());

                    switch (movement.getMovementType()) {
                        case DEPOSIT:
                            account.setBalance(account.getBalance() - movement.getAmount());
                            log.debug("Reversed DEPOSIT: subtracted {} from account balance", movement.getAmount());
                            break;
                        case WITHDRAWAL:
                        case TRANSFER:
                            account.setBalance(account.getBalance() + movement.getAmount());
                            log.debug("Reversed {}: added {} to account balance",
                                    movement.getMovementType(), movement.getAmount());
                            break;
                        default:
                            log.error("Unknown movement type for reversal: {}", movement.getMovementType());
                            throw new IllegalArgumentException("Unknown movement type for reversal");
                    }

                    log.debug("New account balance after reversal: {}", account.getBalance());

                    accountRepository.save(account);
                    movementRepository.save(movement);

                    log.info("Successfully reversed movement {} for account {}",
                            movement.getId(), movement.getAccountId());
                }, () -> {
                    log.warn("Movement with ID {} not found or already reversed", id);
                });
    }

    @Override
    public Object generateMovementsReport(String accountId, ReportFormat format, LocalDate from, LocalDate to) {
        log.info("Generating movements report for account: {}, format: {}, period: {} to {}",
                accountId, format, from, to);

        if (from == null || to == null) {
            YearMonth currentMonth = YearMonth.now();
            from = currentMonth.atDay(1);
            to = currentMonth.atEndOfMonth();
            log.debug("Using default date range: {} to {}", from, to);
        }

        if ("all".equalsIgnoreCase(accountId)) {
            log.debug("Generating report for all accounts");
            List<Movements> movements = getMovementsByAccountAndDateRange(null, from, to);
            log.debug("Found {} movements for all accounts", movements.size());
            Object report = reportService.generateMovementsReport(format, movements, null, from, to);
            log.info("Successfully generated report for all accounts with {} movements", movements.size());
            return report;
        } else {
            UUID accountUuid;
            try {
                accountUuid = UUID.fromString(accountId);
                log.debug("Parsed account ID: {}", accountUuid);
            } catch (IllegalArgumentException e) {
                log.error("Invalid account ID format: {}", accountId);
                throw new IllegalArgumentException("Invalid account ID format: " + accountId);
            }

            Account account = accountRepository.findById(accountUuid)
                    .orElseThrow(() -> {
                        log.error("Account not found for report generation: {}", accountUuid);
                        return new IllegalArgumentException("Account not found");
                    });

            log.debug("Found account {} for report generation", account.getId());

            List<Movements> movements = getMovementsByAccountAndDateRange(accountUuid, from, to);
            log.debug("Found {} movements for account {}", movements.size(), accountUuid);

            Object report = reportService.generateMovementsReport(format, movements, account, from, to);
            log.info("Successfully generated report for account {} with {} movements",
                    accountUuid, movements.size());
            return report;
        }
    }

    private List<Movements> getMovementsByAccountAndDateRange(UUID accountId, LocalDate from, LocalDate to) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);

        log.debug("Querying movements from {} to {} for account: {}",
                fromDateTime, toDateTime, accountId != null ? accountId : "all");

        if (accountId == null) {
            List<Movements> movements = movementRepository.findAllByDateRangeAndIsReversedFalseWithClient(fromDateTime,
                    toDateTime);
            log.debug("Retrieved {} movements for all accounts in date range", movements.size());
            return movements;
        } else {
            List<Movements> movements = movementRepository
                    .findByAccountIdAndDateRangeAndIsReversedFalseWithClient(accountId, fromDateTime, toDateTime);
            log.debug("Retrieved {} movements for account {} in date range", movements.size(), accountId);
            return movements;
        }
    }

    @Override
    public Optional<Movements> getMovement(UUID id) {
        log.debug("Retrieving movement with ID: {}", id);
        Optional<Movements> movement = movementRepository.findByIdAndIsReversedFalse(id);
        if (movement.isPresent()) {
            log.debug("Found movement {} of type {} with amount {}",
                    movement.get().getId(), movement.get().getMovementType(), movement.get().getAmount());
        } else {
            log.debug("Movement with ID {} not found or is reversed", id);
        }
        return movement;
    }
}