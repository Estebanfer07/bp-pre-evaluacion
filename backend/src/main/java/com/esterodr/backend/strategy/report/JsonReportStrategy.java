package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JsonReportStrategy implements ReportStrategy {

    @Override
    public Object generateReport(List<Movements> movements, Account account,
            LocalDate from, LocalDate to) {
        return movements.stream()
                .map(movement -> {
                    Map<String, Object> movementMap = new HashMap<>();
                    movementMap.put("id", movement.getId());
                    movementMap.put("amount", movement.getAmount());
                    movementMap.put("type", movement.getMovementType().toString());
                    movementMap.put("date", movement.getDate());
                    movementMap.put("balance", movement.getBalance());

                    // If account is provided, use it; otherwise get from movement's account
                    // relationship
                    if (account != null) {
                        movementMap.put("accountNumber", account.getAccountNumber());
                    } else if (movement.getAccount() != null) {
                        movementMap.put("accountNumber", movement.getAccount().getAccountNumber());
                        // Include client information when showing all accounts
                        if (movement.getAccount().getClient() != null
                                && movement.getAccount().getClient().getPerson() != null) {
                            movementMap.put("clientName", movement.getAccount().getClient().getPerson().getName());
                            movementMap.put("clientId", movement.getAccount().getClient().getId());
                        }
                    }

                    return movementMap;
                })
                .toList();
    }
}