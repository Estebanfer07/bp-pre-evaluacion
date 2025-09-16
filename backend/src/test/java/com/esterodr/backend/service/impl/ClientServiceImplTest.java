package com.esterodr.backend.service.impl;

import com.esterodr.backend.configuration.ApplicationProperties;
import com.esterodr.backend.domain.Client;
import com.esterodr.backend.domain.Person;
import com.esterodr.backend.domain.enums.ClientState;
import com.esterodr.backend.domain.enums.Gender;
import com.esterodr.backend.repository.ClientRepository;
import com.esterodr.backend.repository.PersonRepository;
import com.esterodr.backend.service.ClientServiceImpl;
import com.esterodr.backend.service.dto.CreateClientWithPersonDto;
import com.esterodr.backend.service.dto.UpdateClientWithPersonDto;
import com.esterodr.backend.util.BeanUtils;
import com.esterodr.backend.util.SimpleEncryptionUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceImplTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private ApplicationProperties appProperties;

    @Mock
    private ApplicationProperties.Encryption encryptionConfiguration;

    @InjectMocks
    private ClientServiceImpl clientService;

    private static final UUID TEST_CLIENT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID TEST_CLIENT_ID_2 = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID TEST_PERSON_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID TEST_PERSON_ID_2 = UUID.fromString("44444444-4444-4444-4444-444444444444");
    private static final String TEST_NAME = "John Doe";
    private static final String TEST_NAME_2 = "Jane Smith";
    private static final String TEST_IDENTIFICATION = "1234567890";
    private static final String TEST_IDENTIFICATION_2 = "0987654321";
    private static final String TEST_ADDRESS = "123 Main St";
    private static final String TEST_ADDRESS_2 = "456 Oak Ave";
    private static final String TEST_PHONE = "+1-555-0123";
    private static final String TEST_PHONE_2 = "+1-555-9876";
    private static final String TEST_PASSWORD = "password123";
    private static final String TEST_ENCRYPTED_PASSWORD = "encryptedPassword123";
    private static final String UPDATED_PASSWORD = "newpassword456";
    private static final String UPDATED_ENCRYPTED_PASSWORD = "encryptedNewPassword456";
    private static final String TEST_SECRET_KEY = "testSecretKey";
    private static final Integer TEST_AGE = 30;
    private static final Integer TEST_AGE_2 = 25;
    private static final Integer UPDATED_AGE = 31;
    private static final Gender TEST_GENDER = Gender.MALE;
    private static final Gender TEST_GENDER_2 = Gender.FEMALE;
    private static final ClientState TEST_CLIENT_STATE = ClientState.ACTIVE;
    private static final ClientState INACTIVE_CLIENT_STATE = ClientState.INACTIVE;

    private Person testPerson;
    private Person testPerson2;
    private Client testClient;
    private Client testClient2;
    private CreateClientWithPersonDto createClientDto;
    private UpdateClientWithPersonDto updateClientDto;

    @BeforeEach
    void setUp() {

        testPerson = Person.builder()
                .id(TEST_PERSON_ID)
                .name(TEST_NAME)
                .gender(TEST_GENDER)
                .age(TEST_AGE)
                .identification(TEST_IDENTIFICATION)
                .address(TEST_ADDRESS)
                .phone(TEST_PHONE)
                .build();

        testPerson2 = Person.builder()
                .id(TEST_PERSON_ID_2)
                .name(TEST_NAME_2)
                .gender(TEST_GENDER_2)
                .age(TEST_AGE_2)
                .identification(TEST_IDENTIFICATION_2)
                .address(TEST_ADDRESS_2)
                .phone(TEST_PHONE_2)
                .build();

        testClient = Client.builder()
                .id(TEST_CLIENT_ID)
                .person(testPerson)
                .password(TEST_ENCRYPTED_PASSWORD)
                .state(TEST_CLIENT_STATE)
                .build();

        testClient2 = Client.builder()
                .id(TEST_CLIENT_ID_2)
                .person(testPerson2)
                .password(TEST_ENCRYPTED_PASSWORD)
                .state(TEST_CLIENT_STATE)
                .build();

        createClientDto = CreateClientWithPersonDto.builder()
                .name(TEST_NAME)
                .gender(TEST_GENDER)
                .age(TEST_AGE)
                .identification(TEST_IDENTIFICATION)
                .address(TEST_ADDRESS)
                .phone(TEST_PHONE)
                .password(TEST_PASSWORD)
                .state(TEST_CLIENT_STATE)
                .build();

        updateClientDto = UpdateClientWithPersonDto.builder()
                .age(UPDATED_AGE)
                .password(UPDATED_PASSWORD)
                .build();
    }

    @Test
    void createClient_ShouldCreateClientWithPerson() {

        when(personRepository.save(any(Person.class))).thenReturn(testPerson);
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);
        when(appProperties.getEncryption()).thenReturn(encryptionConfiguration);
        when(encryptionConfiguration.getSecretKey()).thenReturn(TEST_SECRET_KEY);

        try (MockedStatic<BeanUtils> beanUtilsMock = mockStatic(BeanUtils.class);
                MockedStatic<SimpleEncryptionUtil> encryptionUtilMock = mockStatic(SimpleEncryptionUtil.class)) {

            // Mock BeanUtils to simulate copying password from DTO to Client
            beanUtilsMock.when(() -> BeanUtils.copyNonNullProperties(eq(createClientDto), any(Client.class)))
                    .thenAnswer(invocation -> {
                        Client client = invocation.getArgument(1);
                        client.setPassword(TEST_PASSWORD); // Simulate copying password from DTO
                        return null;
                    });

            encryptionUtilMock.when(() -> SimpleEncryptionUtil.encrypt(TEST_PASSWORD, TEST_SECRET_KEY))
                    .thenReturn(TEST_ENCRYPTED_PASSWORD);

            Object result = clientService.createClient(createClientDto);

            assertNotNull(result);
            assertTrue(result instanceof Client);
            Client resultClient = (Client) result;
            assertNull(resultClient.getPassword());

            verify(personRepository).save(any(Person.class));
            verify(clientRepository).save(any(Client.class));
            verify(appProperties).getEncryption();
            verify(encryptionConfiguration).getSecretKey();
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(createClientDto), any(Person.class)));
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(createClientDto), any(Client.class)));
            encryptionUtilMock.verify(() -> SimpleEncryptionUtil.encrypt(TEST_PASSWORD, TEST_SECRET_KEY));
        }
    }

    @Test
    void createClient_WithoutPassword_ShouldCreateClientWithoutEncryption() {

        CreateClientWithPersonDto dtoWithoutPassword = CreateClientWithPersonDto.builder()
                .name(TEST_NAME)
                .gender(TEST_GENDER)
                .age(TEST_AGE)
                .identification(TEST_IDENTIFICATION)
                .address(TEST_ADDRESS)
                .phone(TEST_PHONE)
                .state(TEST_CLIENT_STATE)
                .build();

        Client clientWithoutPassword = Client.builder()
                .id(TEST_CLIENT_ID)
                .person(testPerson)
                .password(null)
                .state(TEST_CLIENT_STATE)
                .build();

        when(personRepository.save(any(Person.class))).thenReturn(testPerson);
        when(clientRepository.save(any(Client.class))).thenReturn(clientWithoutPassword);

        try (MockedStatic<BeanUtils> beanUtilsMock = mockStatic(BeanUtils.class);
                MockedStatic<SimpleEncryptionUtil> encryptionUtilMock = mockStatic(SimpleEncryptionUtil.class)) {

            Object result = clientService.createClient(dtoWithoutPassword);

            assertNotNull(result);
            assertTrue(result instanceof Client);

            verify(personRepository).save(any(Person.class));
            verify(clientRepository).save(any(Client.class));

            verifyNoInteractions(appProperties);
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(dtoWithoutPassword), any(Person.class)));
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(dtoWithoutPassword), any(Client.class)));
            encryptionUtilMock.verifyNoInteractions();
        }
    }

    @Test
    void updateClient_WithValidId_ShouldUpdateClientAndPerson() {

        when(clientRepository.findById(TEST_CLIENT_ID)).thenReturn(Optional.of(testClient));
        when(personRepository.save(any(Person.class))).thenReturn(testPerson);
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);
        when(appProperties.getEncryption()).thenReturn(encryptionConfiguration);
        when(encryptionConfiguration.getSecretKey()).thenReturn(TEST_SECRET_KEY);

        try (MockedStatic<BeanUtils> beanUtilsMock = mockStatic(BeanUtils.class);
                MockedStatic<SimpleEncryptionUtil> encryptionUtilMock = mockStatic(SimpleEncryptionUtil.class)) {

            beanUtilsMock.when(() -> BeanUtils.copyNonNullProperties(eq(updateClientDto), any(Client.class)))
                    .thenAnswer(invocation -> {
                        Client client = invocation.getArgument(1);
                        client.setPassword(UPDATED_PASSWORD);
                        return null;
                    });

            encryptionUtilMock.when(() -> SimpleEncryptionUtil.encrypt(UPDATED_PASSWORD, TEST_SECRET_KEY))
                    .thenReturn(UPDATED_ENCRYPTED_PASSWORD);

            Object result = clientService.updateClient(TEST_CLIENT_ID, updateClientDto);

            assertNotNull(result);
            assertTrue(result instanceof Client);
            Client resultClient = (Client) result;
            assertNull(resultClient.getPassword());

            verify(clientRepository).findById(TEST_CLIENT_ID);
            verify(personRepository).save(any(Person.class));
            verify(clientRepository).save(any(Client.class));
            verify(appProperties).getEncryption();
            verify(encryptionConfiguration).getSecretKey();
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(updateClientDto), any(Person.class)));
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(updateClientDto), any(Client.class)));
            encryptionUtilMock.verify(() -> SimpleEncryptionUtil.encrypt(UPDATED_PASSWORD, TEST_SECRET_KEY));
        }
    }

    @Test
    void updateClient_WithInvalidId_ShouldThrowException() {

        when(clientRepository.findById(TEST_CLIENT_ID)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> clientService.updateClient(TEST_CLIENT_ID, updateClientDto));

        assertEquals("Client not found", exception.getMessage());
        verify(clientRepository).findById(TEST_CLIENT_ID);
        verify(personRepository, never()).save(any(Person.class));
        verify(clientRepository, never()).save(any(Client.class));
        verifyNoInteractions(appProperties);
    }

    @Test
    void updateClient_WithoutPassword_ShouldUpdateWithoutEncryption() {

        UpdateClientWithPersonDto dtoWithoutPassword = UpdateClientWithPersonDto.builder()
                .age(UPDATED_AGE)
                .build();

        Client clientWithoutPassword = Client.builder()
                .id(TEST_CLIENT_ID)
                .person(testPerson)
                .password(null)
                .state(TEST_CLIENT_STATE)
                .build();

        when(clientRepository.findById(TEST_CLIENT_ID)).thenReturn(Optional.of(clientWithoutPassword));
        when(personRepository.save(any(Person.class))).thenReturn(testPerson);
        when(clientRepository.save(any(Client.class))).thenReturn(clientWithoutPassword);

        try (MockedStatic<BeanUtils> beanUtilsMock = mockStatic(BeanUtils.class)) {

            Object result = clientService.updateClient(TEST_CLIENT_ID, dtoWithoutPassword);

            assertNotNull(result);
            assertTrue(result instanceof Client);

            verify(clientRepository).findById(TEST_CLIENT_ID);
            verify(personRepository).save(any(Person.class));
            verify(clientRepository).save(any(Client.class));

            verifyNoInteractions(appProperties);
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(dtoWithoutPassword), any(Person.class)));
            beanUtilsMock.verify(() -> BeanUtils.copyNonNullProperties(eq(dtoWithoutPassword), any(Client.class)));
        }
    }

    @Test
    void deleteClient_WithValidId_ShouldSetStateToInactive() {

        when(clientRepository.findById(TEST_CLIENT_ID)).thenReturn(Optional.of(testClient));
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        clientService.deleteClient(TEST_CLIENT_ID);

        verify(clientRepository).findById(TEST_CLIENT_ID);
        verify(clientRepository).save(argThat(client -> client.getState() == INACTIVE_CLIENT_STATE));
    }

    @Test
    void deleteClient_WithInvalidId_ShouldThrowException() {

        when(clientRepository.findById(TEST_CLIENT_ID)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> clientService.deleteClient(TEST_CLIENT_ID));

        assertEquals("Client not found", exception.getMessage());
        verify(clientRepository).findById(TEST_CLIENT_ID);
        verify(clientRepository, never()).save(any(Client.class));
    }

    @Test
    void getClient_WithValidId_ShouldReturnClientWithoutPassword() {

        when(clientRepository.findByIdAndState(TEST_CLIENT_ID, TEST_CLIENT_STATE))
                .thenReturn(Optional.of(testClient));

        Object result = clientService.getClient(TEST_CLIENT_ID);

        assertNotNull(result);
        assertTrue(result instanceof Client);
        Client resultClient = (Client) result;
        assertNull(resultClient.getPassword());
        assertEquals(testClient.getId(), resultClient.getId());
        assertEquals(testClient.getPerson().getName(), resultClient.getPerson().getName());

        verify(clientRepository).findByIdAndState(TEST_CLIENT_ID, TEST_CLIENT_STATE);
    }

    @Test
    void getClient_WithInvalidId_ShouldThrowException() {

        when(clientRepository.findByIdAndState(TEST_CLIENT_ID, TEST_CLIENT_STATE))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> clientService.getClient(TEST_CLIENT_ID));

        assertEquals("Active client not found", exception.getMessage());
        verify(clientRepository).findByIdAndState(TEST_CLIENT_ID, TEST_CLIENT_STATE);
    }

    @Test
    void getAllClients_ShouldReturnListOfActiveClientsWithoutPasswords() {

        List<Client> clientList = Arrays.asList(testClient, testClient2);
        when(clientRepository.findAllByState(TEST_CLIENT_STATE)).thenReturn(clientList);

        List<Object> result = clientService.getAllClients();

        assertNotNull(result);
        assertEquals(2, result.size());

        result.forEach(obj -> {
            assertTrue(obj instanceof Client);
            Client client = (Client) obj;
            assertNull(client.getPassword());
        });

        verify(clientRepository).findAllByState(TEST_CLIENT_STATE);
    }

    @Test
    void getAllClients_WhenNoActiveClients_ShouldReturnEmptyList() {

        when(clientRepository.findAllByState(TEST_CLIENT_STATE)).thenReturn(List.of());

        List<Object> result = clientService.getAllClients();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(clientRepository).findAllByState(TEST_CLIENT_STATE);
    }
}