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
@RequestMapping("/movements")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MovementsController {

    MovementService movementService;

    @PostMapping
    public ResponseEntity<Movements> createMovement(@Valid @RequestBody CreateMovementDto movementData) {
        try {
            Movements movement = movementService.createMovement(movementData);
            return ResponseEntity.status(HttpStatus.CREATED).body(movement);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovement(@PathVariable UUID id) {
        movementService.deleteMovement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Object> getMovements(
            @RequestParam(defaultValue = "JSON") ReportFormat format,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        Object result = movementService.generateMovementsReport(format, from, to);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movements> getMovement(@PathVariable UUID id) {
        return movementService.getMovement(id)
                .map(movement -> ResponseEntity.ok(movement))
                .orElse(ResponseEntity.notFound().build());
    }
}