package com.esterodr.backend.service;

import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;

import java.util.List;

public interface ReportService {

    Object generateMovementsReport(ReportFormat format, List<Movements> movements);
}