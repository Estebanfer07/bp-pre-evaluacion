package com.esterodr.backend.service;

import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.service.dto.CreateMovementDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MovementService {

    Movements createMovement(CreateMovementDto movementData);

    void deleteMovement(UUID id);

    List<Movements> getMovementsByDateRange(LocalDate from, LocalDate to);

    Object generateMovementsReport(ReportFormat format, LocalDate from, LocalDate to);

    Optional<Movements> getMovement(UUID id);
}