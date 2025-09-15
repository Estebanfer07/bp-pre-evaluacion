package com.esterodr.backend.service;

import com.esterodr.backend.repository.ClientRepository;
import com.esterodr.backend.repository.PersonRepository;
import com.esterodr.backend.service.dto.CreateClientWithPersonDto;
import com.esterodr.backend.service.dto.UpdateClientWithPersonDto;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ClientServiceImpl implements ClientService {
    ClientRepository clientRepository;
    PersonRepository personRepository;

    @Override
    public Object createClient(CreateClientWithPersonDto dto) {
        // Create person
        com.esterodr.backend.domain.Person person = new com.esterodr.backend.domain.Person();
        person.setName(dto.getName());
        person.setGender(dto.getGender());
        person.setAge(dto.getAge());
        person.setIdentification(dto.getIdentification());
        person.setAddress(dto.getAddress());
        person.setPhone(dto.getPhone());
        person = personRepository.save(person);

        // Create client
        com.esterodr.backend.domain.Client client = new com.esterodr.backend.domain.Client();
        client.setPerson(person);
        client.setPassword(dto.getPassword());
        client.setState(dto.getState());
        client = clientRepository.save(client);
        return client;
    }

    @Override
    public Object updateClient(UUID id, UpdateClientWithPersonDto dto) {
        com.esterodr.backend.domain.Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        com.esterodr.backend.domain.Person person = client.getPerson();
        if (dto.getName() != null)
            person.setName(dto.getName());
        if (dto.getGender() != null)
            person.setGender(dto.getGender());
        if (dto.getAge() != null)
            person.setAge(dto.getAge());
        if (dto.getIdentification() != null)
            person.setIdentification(dto.getIdentification());
        if (dto.getAddress() != null)
            person.setAddress(dto.getAddress());
        if (dto.getPhone() != null)
            person.setPhone(dto.getPhone());
        personRepository.save(person);
        if (dto.getPassword() != null)
            client.setPassword(dto.getPassword());
        if (dto.getState() != null)
            client.setState(dto.getState());
        client = clientRepository.save(client);
        return client;
    }

    @Override
    public void deleteClient(UUID id) {
        com.esterodr.backend.domain.Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setState(com.esterodr.backend.domain.enums.ClientState.INACTIVE);
        clientRepository.save(client);
    }

    @Override
    public Object getClient(UUID id) {
        return clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));
    }

    @Override
    public List<Object> getAllClients() {
        return new java.util.ArrayList<>(clientRepository.findAll());
    }
}
