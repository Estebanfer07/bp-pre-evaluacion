package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Movements;

import java.util.List;

public interface ReportStrategy {

    Object generateReport(List<Movements> movements);
}