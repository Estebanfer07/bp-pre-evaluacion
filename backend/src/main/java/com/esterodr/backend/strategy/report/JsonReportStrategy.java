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
        List<Map<String, Object>> movementsList = movements.stream()
                .map(movement -> {
                    Map<String, Object> movementMap = new HashMap<>();
                    movementMap.put("id", movement.getId());
                    movementMap.put("amount", movement.getAmount());
                    movementMap.put("type", movement.getMovementType().toString());
                    movementMap.put("date", movement.getDate());
                    movementMap.put("balance", movement.getBalance());

                    if (account != null) {
                        movementMap.put("accountNumber", account.getAccountNumber());
                        if (account.getClient() != null
                                && account.getClient().getPerson() != null) {
                            movementMap.put("clientName", account.getClient().getPerson().getName());
                            movementMap.put("clientId",
                                    account.getClient().getPerson().getIdentification());
                        }
                    } else if (movement.getAccount() != null) {
                        movementMap.put("accountNumber", movement.getAccount().getAccountNumber());

                        if (movement.getAccount().getClient() != null
                                && movement.getAccount().getClient().getPerson() != null) {
                            movementMap.put("clientName", movement.getAccount().getClient().getPerson().getName());
                            movementMap.put("clientId",
                                    movement.getAccount().getClient().getPerson().getIdentification());
                        }
                    }

                    return movementMap;
                })
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("jsonReport", movementsList);
        return response;
    }
}