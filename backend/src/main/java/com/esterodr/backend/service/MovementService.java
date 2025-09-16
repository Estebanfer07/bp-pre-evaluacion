package com.esterodr.backend.service;

import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.service.dto.CreateMovementDto;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface MovementService {

    Movements createMovement(CreateMovementDto movementData);

    void deleteMovement(UUID id);

    Object generateMovementsReport(String accountId, ReportFormat format, LocalDate from, LocalDate to);

    Optional<Movements> getMovement(UUID id);
}