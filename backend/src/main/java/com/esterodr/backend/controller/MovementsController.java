package com.esterodr.backend.controller;

import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.service.MovementService;
import com.esterodr.backend.service.dto.CreateMovementDto;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/movements")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MovementsController {

    MovementService movementService;

    @PostMapping
    public ResponseEntity<Movements> createMovement(@Valid @RequestBody CreateMovementDto movementData) {
        Movements movement = movementService.createMovement(movementData);
        return ResponseEntity.status(HttpStatus.CREATED).body(movement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovement(@PathVariable UUID id) {
        movementService.deleteMovement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/account/{accountId}/report")
    public ResponseEntity<Object> generateReport(
            @PathVariable String accountId,
            @RequestParam(defaultValue = "JSON") ReportFormat format,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        Object report = movementService.generateMovementsReport(accountId, format, from, to);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movements> getMovement(@PathVariable UUID id) {
        return movementService.getMovement(id)
                .map(movement -> ResponseEntity.ok(movement))
                .orElse(ResponseEntity.notFound().build());
    }
}