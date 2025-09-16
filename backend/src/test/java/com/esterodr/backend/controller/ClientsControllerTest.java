package com.esterodr.backend.controller;

import com.esterodr.backend.domain.Client;
import com.esterodr.backend.domain.Person;
import com.esterodr.backend.domain.enums.ClientState;
import com.esterodr.backend.domain.enums.Gender;
import com.esterodr.backend.service.ClientService;
import com.esterodr.backend.service.dto.CreateClientWithPersonDto;
import com.esterodr.backend.service.dto.UpdateClientWithPersonDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ClientsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ClientService clientService;

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
    private static final String UPDATED_PASSWORD = "newpassword456";
    private static final Integer TEST_AGE = 30;
    private static final Integer TEST_AGE_2 = 25;
    private static final Integer UPDATED_AGE = 31;
    private static final Gender TEST_GENDER = Gender.MALE;
    private static final Gender TEST_GENDER_2 = Gender.FEMALE;
    private static final ClientState TEST_CLIENT_STATE = ClientState.ACTIVE;

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
                .password(null)
                .state(TEST_CLIENT_STATE)
                .build();

        testClient2 = Client.builder()
                .id(TEST_CLIENT_ID_2)
                .person(testPerson2)
                .password(null)
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
    void createClient_ShouldReturnCreatedClient() throws Exception {

        when(clientService.createClient(any(CreateClientWithPersonDto.class))).thenReturn(testClient);

        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createClientDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(TEST_CLIENT_ID.toString()))
                .andExpect(jsonPath("$.person.name").value(TEST_NAME))
                .andExpect(jsonPath("$.person.identification").value(TEST_IDENTIFICATION))
                .andExpect(jsonPath("$.state").value(TEST_CLIENT_STATE.toString()))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(clientService).createClient(any(CreateClientWithPersonDto.class));
    }

    @Test
    void updateClient_WithValidId_ShouldReturnUpdatedClient() throws Exception {

        when(clientService.updateClient(eq(TEST_CLIENT_ID), any(UpdateClientWithPersonDto.class)))
                .thenReturn(testClient);

        mockMvc.perform(patch("/api/clients/{id}", TEST_CLIENT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateClientDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(TEST_CLIENT_ID.toString()))
                .andExpect(jsonPath("$.person.name").value(TEST_NAME))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(clientService).updateClient(eq(TEST_CLIENT_ID), any(UpdateClientWithPersonDto.class));
    }

    @Test
    void updateClient_WithInvalidId_ShouldReturnError() throws Exception {

        when(clientService.updateClient(eq(TEST_CLIENT_ID), any(UpdateClientWithPersonDto.class)))
                .thenThrow(new RuntimeException("Client not found"));

        mockMvc.perform(patch("/api/clients/{id}", TEST_CLIENT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateClientDto)))
                .andDo(print())
                .andExpect(status().isInternalServerError());

        verify(clientService).updateClient(eq(TEST_CLIENT_ID), any(UpdateClientWithPersonDto.class));
    }

    @Test
    void deleteClient_WithValidId_ShouldReturnNoContent() throws Exception {

        doNothing().when(clientService).deleteClient(TEST_CLIENT_ID);

        mockMvc.perform(delete("/api/clients/{id}", TEST_CLIENT_ID))
                .andDo(print())
                .andExpect(status().isNoContent());

        verify(clientService).deleteClient(TEST_CLIENT_ID);
    }

    @Test
    void deleteClient_WithInvalidId_ShouldReturnError() throws Exception {

        doThrow(new RuntimeException("Client not found")).when(clientService).deleteClient(TEST_CLIENT_ID);

        mockMvc.perform(delete("/api/clients/{id}", TEST_CLIENT_ID))
                .andDo(print())
                .andExpect(status().isInternalServerError());

        verify(clientService).deleteClient(TEST_CLIENT_ID);
    }

    @Test
    void getClient_WithValidId_ShouldReturnClient() throws Exception {

        when(clientService.getClient(TEST_CLIENT_ID)).thenReturn(testClient);

        mockMvc.perform(get("/api/clients/{id}", TEST_CLIENT_ID))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(TEST_CLIENT_ID.toString()))
                .andExpect(jsonPath("$.person.name").value(TEST_NAME))
                .andExpect(jsonPath("$.person.identification").value(TEST_IDENTIFICATION))
                .andExpect(jsonPath("$.state").value(TEST_CLIENT_STATE.toString()))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(clientService).getClient(TEST_CLIENT_ID);
    }

    @Test
    void getClient_WithInvalidId_ShouldReturnError() throws Exception {

        when(clientService.getClient(TEST_CLIENT_ID)).thenThrow(new RuntimeException("Active client not found"));

        mockMvc.perform(get("/api/clients/{id}", TEST_CLIENT_ID))
                .andDo(print())
                .andExpect(status().isInternalServerError());

        verify(clientService).getClient(TEST_CLIENT_ID);
    }

    @Test
    void getAllClients_ShouldReturnListOfClients() throws Exception {

        List<Object> clientList = Arrays.asList(testClient, testClient2);
        when(clientService.getAllClients()).thenReturn(clientList);

        mockMvc.perform(get("/api/clients"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(TEST_CLIENT_ID.toString()))
                .andExpect(jsonPath("$[0].person.name").value(TEST_NAME))
                .andExpect(jsonPath("$[1].id").value(TEST_CLIENT_ID_2.toString()))
                .andExpect(jsonPath("$[1].person.name").value(TEST_NAME_2))
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[1].password").doesNotExist());

        verify(clientService).getAllClients();
    }

    @Test
    void getAllClients_WhenNoClients_ShouldReturnEmptyList() throws Exception {

        when(clientService.getAllClients()).thenReturn(List.of());

        mockMvc.perform(get("/api/clients"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0));

        verify(clientService).getAllClients();
    }

    @Test
    void createClient_WithInvalidData_ShouldNotCallService() throws Exception {

        CreateClientWithPersonDto invalidDto = CreateClientWithPersonDto.builder()
                .name("")
                .age(-1)
                .build();

        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(clientService, never()).createClient(any(CreateClientWithPersonDto.class));
    }

    @Test
    void updateClient_WithInvalidData_ShouldStillCallService() throws Exception {

        UpdateClientWithPersonDto invalidDto = UpdateClientWithPersonDto.builder()
                .age(-1)
                .password("123")
                .build();

        when(clientService.updateClient(eq(TEST_CLIENT_ID), any(UpdateClientWithPersonDto.class)))
                .thenReturn(testClient);

        mockMvc.perform(patch("/api/clients/{id}", TEST_CLIENT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(clientService, never()).updateClient(eq(TEST_CLIENT_ID), any(UpdateClientWithPersonDto.class));
    }
}