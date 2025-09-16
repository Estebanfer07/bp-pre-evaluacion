package com.esterodr.backend.service.impl;

import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.service.ReportService;
import com.esterodr.backend.strategy.report.JsonReportStrategy;
import com.esterodr.backend.strategy.report.PdfReportStrategy;
import com.esterodr.backend.strategy.report.ReportStrategy;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ReportServiceImpl implements ReportService {

    JsonReportStrategy jsonReportStrategy;
    PdfReportStrategy pdfReportStrategy;

    @Override
    public Object generateMovementsReport(ReportFormat format, List<Movements> movements) {
        // Use the appropriate strategy to generate the report
        ReportStrategy strategy = getReportStrategy(format);
        return strategy.generateReport(movements);
    }

    private ReportStrategy getReportStrategy(ReportFormat format) {
        return switch (format) {
            case JSON -> jsonReportStrategy;
            case PDF -> pdfReportStrategy;
        };
    }
}