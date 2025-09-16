package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PdfReportStrategy implements ReportStrategy {

    @Override
    public Object generateReport(List<Movements> movements, Account account,
            LocalDate from, LocalDate to) {
        Map<String, Object> pdfData = new HashMap<>();
        pdfData.put("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        if (account != null) {
            pdfData.put("title", "Account Movement Report");
            String clientName = account.getClient() != null && account.getClient().getPerson() != null
                    ? account.getClient().getPerson().getName()
                    : "";
            String clientIdentification = account.getClient() != null && account.getClient().getPerson() != null
                    ? account.getClient().getPerson().getIdentification()
                    : "";
            String accountNumber = account.getAccountNumber();

            pdfData.put("clientName", clientName);
            pdfData.put("clientIdentification", clientIdentification);
            pdfData.put("accountNumber", accountNumber);
        } else {
            pdfData.put("title", "All Accounts Movement Report");
            pdfData.put("clientName", "Multiple Clients");
            pdfData.put("clientIdentification", "N/A");
            pdfData.put("accountNumber", "All Accounts");
        }

        String fromDate = from != null ? from.format(DateTimeFormatter.ISO_LOCAL_DATE) : "";
        String toDate = to != null ? to.format(DateTimeFormatter.ISO_LOCAL_DATE) : "";
        pdfData.put("from", fromDate);
        pdfData.put("to", toDate);

        List<Map<String, Object>> formattedMovements = movements.stream()
                .map(movement -> formatMovementForPdf(movement, account == null))
                .toList();

        pdfData.put("movements", formattedMovements);
        pdfData.put("format", "PDF");

        return pdfData;
    }

    private Map<String, Object> formatMovementForPdf(Movements movement, boolean includeAccountInfo) {
        Map<String, Object> formatted = new HashMap<>();
        formatted.put("id", movement.getId().toString());
        formatted.put("date", movement.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
        formatted.put("type", movement.getMovementType().toString());
        formatted.put("amount", String.format("%.2f", movement.getAmount()));
        formatted.put("balance", String.format("%.2f", movement.getBalance()));
        formatted.put("isCredit", movement.getAmount() > 0);

        double initialBalance;
        switch (movement.getMovementType()) {
            case DEPOSIT:
                initialBalance = movement.getBalance() - movement.getAmount();
                break;
            case WITHDRAWAL:
            case TRANSFER:
                initialBalance = movement.getBalance() + movement.getAmount();
                break;
            default:
                initialBalance = movement.getBalance();
        }
        formatted.put("initialBalance", String.format("%.2f", initialBalance));

        if (includeAccountInfo && movement.getAccount() != null) {
            formatted.put("accountNumber", movement.getAccount().getAccountNumber());
            if (movement.getAccount().getClient() != null && movement.getAccount().getClient().getPerson() != null) {
                formatted.put("clientName", movement.getAccount().getClient().getPerson().getName());
                formatted.put("clientId", movement.getAccount().getClient().getId());
            }
        }

        return formatted;
    }
}