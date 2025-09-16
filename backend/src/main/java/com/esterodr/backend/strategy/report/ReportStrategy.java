package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;

import java.time.LocalDate;
import java.util.List;

public interface ReportStrategy {

    Object generateReport(List<Movements> movements, Account account,
            LocalDate from, LocalDate to);
}