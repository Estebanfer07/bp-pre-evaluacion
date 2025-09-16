package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Movements;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JsonReportStrategy implements ReportStrategy {

    @Override
    public Object generateReport(List<Movements> movements) {
        return movements;
    }
}