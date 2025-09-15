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

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ClientServiceImpl implements ClientService {

    ApplicationProperties appProperties;
    ClientRepository clientRepository;
    PersonRepository personRepository;

    @Override
    public Object createClient(CreateClientWithPersonDto dto) {
        Person person = new Person();
        BeanUtils.copyNonNullProperties(dto, person);
        person = personRepository.save(person);

        Client client = new Client();
        client.setPerson(person);
        BeanUtils.copyNonNullProperties(dto, client);

        if (client.getPassword() != null) {
            String encrypted = SimpleEncryptionUtil.encrypt(client.getPassword(),
                    appProperties.getEncryption().getSecretKey());
            client.setPassword(encrypted);
        }

        client = clientRepository.save(client);

        client.setPassword(null);
        return client;
    }

    @Override
    public Object updateClient(UUID id, UpdateClientWithPersonDto clientData) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Person person = client.getPerson();

        BeanUtils.copyNonNullProperties(clientData, person);
        personRepository.save(person);

        BeanUtils.copyNonNullProperties(clientData, client);
        // Encrypt password before saving
        if (client.getPassword() != null) {
            String encrypted = SimpleEncryptionUtil.encrypt(client.getPassword(),
                    appProperties.getEncryption().getSecretKey());
            client.setPassword(encrypted);
        }
        client = clientRepository.save(client);

        client.setPassword(null);
        return client;
    }

    @Override
    public void deleteClient(UUID id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setState(ClientState.INACTIVE);
        clientRepository.save(client);
    }

    @Override
    public Object getClient(UUID id) {
        Client client = clientRepository.findByIdAndState(id, ClientState.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Active client not found"));

        client.setPassword(null);
        return client;
    }

    @Override
    public List<Object> getAllClients() {
        List<Client> clients = clientRepository.findAllByState(ClientState.ACTIVE);

        clients.forEach(c -> c.setPassword(null));
        return new java.util.ArrayList<>(clients);
    }
}
