package com.esterodr.backend.service;

import com.esterodr.backend.service.dto.CreateClientWithPersonDto;
import com.esterodr.backend.service.dto.UpdateClientWithPersonDto;
import java.util.List;
import java.util.UUID;

public interface ClientService {
    Object createClient(CreateClientWithPersonDto dto);

    Object updateClient(UUID id, UpdateClientWithPersonDto dto);

    void deleteClient(UUID id);

    Object getClient(UUID id);

    List<Object> getAllClients();
}
