package com.esterodr.backend.service;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    Object generateMovementsReport(ReportFormat format, List<Movements> movements, Account account,
            LocalDate from, LocalDate to);
}