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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
        Account account = accountRepository.findById(movementData.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        var factory = movementFactoryProvider.getFactory(movementData.getMovementType());

        Movements movement = factory.createMovement(movementData, account);

        accountRepository.save(account);

        return movementRepository.save(movement);
    }

    @Override
    public void deleteMovement(UUID id) {
        movementRepository.findByIdAndIsReversedFalse(id)
                .ifPresent(movement -> {
                    movement.setReversed(true);
                    Account account = accountRepository.findById(movement.getAccountId())
                            .orElseThrow(() -> new IllegalArgumentException("Account not found for movement reversal"));
                    switch (movement.getMovementType()) {
                        case DEPOSIT:
                            account.setBalance(account.getBalance() - movement.getAmount());
                            break;
                        case WITHDRAWAL:
                        case TRANSFER:
                            account.setBalance(account.getBalance() + movement.getAmount());
                            break;
                        default:
                            throw new IllegalArgumentException("Unknown movement type for reversal");
                    }
                    accountRepository.save(account);
                    movementRepository.save(movement);
                });
    }

    @Override
    public List<Movements> getMovementsByDateRange(LocalDate from, LocalDate to) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.atTime(23, 59, 59);
        return movementRepository.findByDateRangeAndIsReversedFalse(fromDateTime, toDateTime);
    }

    @Override
    public Object generateMovementsReport(ReportFormat format, LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            YearMonth currentMonth = YearMonth.now();
            from = currentMonth.atDay(1);
            to = currentMonth.atEndOfMonth();
        }

        List<Movements> movements = getMovementsByDateRange(from, to);

        return reportService.generateMovementsReport(format, movements);
    }

    @Override
    public Optional<Movements> getMovement(UUID id) {
        return movementRepository.findByIdAndIsReversedFalse(id);
    }
}