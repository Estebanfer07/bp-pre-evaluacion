package com.esterodr.backend.service;

import com.esterodr.backend.domain.*;
import com.esterodr.backend.domain.enums.ClientState;
import com.esterodr.backend.repository.*;
import com.esterodr.backend.service.dto.*;
import com.esterodr.backend.util.BeanUtils;
import com.esterodr.backend.util.SimpleEncryptionUtil;
import com.esterodr.backend.configuration.ApplicationProperties;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class ClientServiceImpl implements ClientService {

    ApplicationProperties appProperties;
    ClientRepository clientRepository;
    PersonRepository personRepository;

    @Override
    public Object createClient(CreateClientWithPersonDto dto) {
        log.info("Creating new client with identification: {}", dto.getIdentification());
        Person person = new Person();
        BeanUtils.copyNonNullProperties(dto, person);
        person = personRepository.save(person);
        log.debug("Person created with ID: {}", person.getId());

        Client client = new Client();
        client.setPerson(person);
        BeanUtils.copyNonNullProperties(dto, client);

        if (client.getPassword() != null) {
            log.debug("Encrypting client password");
            String encrypted = SimpleEncryptionUtil.encrypt(client.getPassword(),
                    appProperties.getEncryption().getSecretKey());
            client.setPassword(encrypted);
        }

        client = clientRepository.save(client);
        log.info("Client created successfully with ID: {} for person: {}",
                client.getId(), client.getPerson().getName());

        client.setPassword(null);
        return client;
    }

    @Override
    public Object updateClient(UUID id, UpdateClientWithPersonDto clientData) {
        log.info("Updating client with ID: {}", id);
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Person person = client.getPerson();

        log.debug("Client found, applying updates for person: {}", person.getName());
        BeanUtils.copyNonNullProperties(clientData, person);
        personRepository.save(person);

        BeanUtils.copyNonNullProperties(clientData, client);
        // Encrypt password before saving
        if (client.getPassword() != null) {
            log.debug("Encrypting updated client password");
            String encrypted = SimpleEncryptionUtil.encrypt(client.getPassword(),
                    appProperties.getEncryption().getSecretKey());
            client.setPassword(encrypted);
        }
        client = clientRepository.save(client);
        log.info("Client updated successfully: {}", client.getId());

        client.setPassword(null);
        return client;
    }

    @Override
    public void deleteClient(UUID id) {
        log.info("Soft deleting client with ID: {}", id);
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setState(ClientState.INACTIVE);
        Client savedClient = clientRepository.save(client);
        log.info("Client soft deleted successfully: {}", savedClient.getId());
    }

    @Override
    public Object getClient(UUID id) {
        log.debug("Retrieving active client with ID: {}", id);
        Client client = clientRepository.findByIdAndState(id, ClientState.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Active client not found"));

        log.debug("Client found: {}", client.getPerson().getName());
        client.setPassword(null);
        return client;
    }

    @Override
    public List<Object> getAllClients() {
        log.info("Retrieving all active clients");
        List<Client> clients = clientRepository.findAllByState(ClientState.ACTIVE);

        clients.forEach(c -> c.setPassword(null));
        log.info("Found {} active clients", clients.size());
        return new java.util.ArrayList<>(clients);
    }
}
