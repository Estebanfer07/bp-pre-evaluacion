package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Movements;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PdfReportStrategy implements ReportStrategy {

    @Override
    public Object generateReport(List<Movements> movements) {
        Map<String, Object> pdfData = new HashMap<>();
        pdfData.put("title", "Movements Report");
        pdfData.put("generatedAt", java.time.LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        List<Map<String, Object>> formattedMovements = movements.stream()
                .map(this::formatMovementForPdf)
                .toList();

        pdfData.put("movements", formattedMovements);
        pdfData.put("format", "PDF");

        return pdfData;
    }

    private Map<String, Object> formatMovementForPdf(Movements movement) {
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
        return formatted;
    }
}