package com.esterodr.backend.controller;

import com.esterodr.backend.service.dto.CreateClientWithPersonDto;
import com.esterodr.backend.service.dto.UpdateClientWithPersonDto;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.esterodr.backend.service.ClientService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
public class ClientsController {
    @Autowired
    private ClientService clientService;

    @PostMapping
    public ResponseEntity<?> createClient(@Valid @RequestBody CreateClientWithPersonDto dto) {
        return ResponseEntity.ok(clientService.createClient(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateClient(@PathVariable UUID id, @Valid @RequestBody UpdateClientWithPersonDto dto) {
        return ResponseEntity.ok(clientService.updateClient(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable UUID id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClient(@PathVariable UUID id) {
        return ResponseEntity.ok(clientService.getClient(id));
    }

    @GetMapping
    public ResponseEntity<List<?>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }
}
