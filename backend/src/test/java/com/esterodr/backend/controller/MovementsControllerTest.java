package com.esterodr.backend.controller;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.domain.enums.ReportFormat;
import com.esterodr.backend.service.MovementService;
import com.esterodr.backend.service.dto.CreateMovementDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MovementsController.class)
class MovementsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MovementService movementService;

    private static final UUID TEST_MOVEMENT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID TEST_ACCOUNT_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID TEST_CLIENT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final String TEST_ACCOUNT_NUMBER = "123456789012";
    private static final Double TEST_AMOUNT = 500.0;
    private static final Double TEST_BALANCE_BEFORE = 1000.0;
    private static final Double TEST_BALANCE_AFTER = 1500.0;
    private static final MovementType TEST_MOVEMENT_TYPE = MovementType.DEPOSIT;
    private static final ReportFormat TEST_REPORT_FORMAT_JSON = ReportFormat.JSON;
    private static final ReportFormat TEST_REPORT_FORMAT_PDF = ReportFormat.PDF;
    private static final LocalDate TEST_FROM_DATE = LocalDate.of(2025, 9, 1);
    private static final LocalDate TEST_TO_DATE = LocalDate.of(2025, 9, 30);
    private static final LocalDateTime TEST_MOVEMENT_DATE = LocalDateTime.of(2025, 9, 16, 10, 30);
    private static final String TEST_ACCOUNT_ID_ALL = "all";
    private static final String TEST_REPORT_RESPONSE = "{\"report\": \"test\"}";

    private Account testAccount;
    private Movements testMovement;
    private CreateMovementDto createMovementDto;

    @BeforeEach
    void setUp() {
        testAccount = Account.builder()
                .id(TEST_ACCOUNT_ID)
                .accountNumber(TEST_ACCOUNT_NUMBER)
                .type(AccountType.AHO)
                .balance(TEST_BALANCE_BEFORE)
                .clientId(TEST_CLIENT_ID)
                .build();

        testMovement = Movements.builder()
                .id(TEST_MOVEMENT_ID)
                .accountId(TEST_ACCOUNT_ID)
                .account(testAccount)
                .date(TEST_MOVEMENT_DATE)
                .movementType(TEST_MOVEMENT_TYPE)
                .amount(TEST_AMOUNT)
                .balance(TEST_BALANCE_AFTER)
                .isReversed(false)
                .build();

        createMovementDto = CreateMovementDto.builder()
                .accountId(TEST_ACCOUNT_ID)
                .movementType(TEST_MOVEMENT_TYPE)
                .amount(TEST_AMOUNT)
                .build();
    }

    @Test
    void createMovement_ShouldReturnCreatedMovement() throws Exception {
        when(movementService.createMovement(any(CreateMovementDto.class))).thenReturn(testMovement);

        mockMvc.perform(post("/api/movements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createMovementDto)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(TEST_MOVEMENT_ID.toString()))
                .andExpect(jsonPath("$.accountId").value(TEST_ACCOUNT_ID.toString()))
                .andExpect(jsonPath("$.movementType").value(TEST_MOVEMENT_TYPE.name()))
                .andExpect(jsonPath("$.amount").value(TEST_AMOUNT))
                .andExpect(jsonPath("$.balance").value(TEST_BALANCE_AFTER))
                .andExpect(jsonPath("$.reversed").value(false));
        verify(movementService).createMovement(any(CreateMovementDto.class));
    }

    @Test
    void createMovement_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        when(movementService.createMovement(any(CreateMovementDto.class)))
                .thenThrow(new IllegalArgumentException("Account not found"));

        mockMvc.perform(post("/api/movements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createMovementDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(movementService).createMovement(any(CreateMovementDto.class));
    }

    @Test
    void createMovement_WithValidationErrors_ShouldReturnBadRequest() throws Exception {
        CreateMovementDto invalidDto = CreateMovementDto.builder()
                .accountId(null) // Invalid - null account ID
                .movementType(TEST_MOVEMENT_TYPE)
                .amount(-100.0) // Invalid - negative amount
                .build();

        mockMvc.perform(post("/api/movements")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andDo(print())
                .andExpect(status().isBadRequest());

        verify(movementService, never()).createMovement(any(CreateMovementDto.class));
    }

    @Test
    void deleteMovement_ShouldReturnNoContent() throws Exception {
        doNothing().when(movementService).deleteMovement(TEST_MOVEMENT_ID);

        mockMvc.perform(delete("/api/movements/{id}", TEST_MOVEMENT_ID))
                .andDo(print())
                .andExpect(status().isNoContent());

        verify(movementService).deleteMovement(TEST_MOVEMENT_ID);
    }

    @Test
    void getMovement_WithValidId_ShouldReturnMovement() throws Exception {
        when(movementService.getMovement(TEST_MOVEMENT_ID)).thenReturn(Optional.of(testMovement));

        mockMvc.perform(get("/api/movements/{id}", TEST_MOVEMENT_ID))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(TEST_MOVEMENT_ID.toString()))
                .andExpect(jsonPath("$.accountId").value(TEST_ACCOUNT_ID.toString()))
                .andExpect(jsonPath("$.movementType").value(TEST_MOVEMENT_TYPE.toString()))
                .andExpect(jsonPath("$.amount").value(TEST_AMOUNT));

        verify(movementService).getMovement(TEST_MOVEMENT_ID);
    }

    @Test
    void getMovement_WithInvalidId_ShouldReturnNotFound() throws Exception {
        when(movementService.getMovement(TEST_MOVEMENT_ID)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/movements/{id}", TEST_MOVEMENT_ID))
                .andDo(print())
                .andExpect(status().isNotFound());

        verify(movementService).getMovement(TEST_MOVEMENT_ID);
    }

    @Test
    void generateReport_WithSpecificAccount_ShouldReturnReport() throws Exception {
        when(movementService.generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE)))
                .thenReturn(TEST_REPORT_RESPONSE);

        mockMvc.perform(get("/api/movements/account/{accountId}/report", TEST_ACCOUNT_ID)
                .param("format", "JSON")
                .param("from", "2025-09-01")
                .param("to", "2025-09-30"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(TEST_REPORT_RESPONSE));

        verify(movementService).generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE));
    }

    @Test
    void generateReport_WithAllAccounts_ShouldReturnReport() throws Exception {
        when(movementService.generateMovementsReport(
                eq(TEST_ACCOUNT_ID_ALL),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE)))
                .thenReturn(TEST_REPORT_RESPONSE);

        mockMvc.perform(get("/api/movements/account/{accountId}/report", TEST_ACCOUNT_ID_ALL)
                .param("format", "JSON")
                .param("from", "2025-09-01")
                .param("to", "2025-09-30"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(TEST_REPORT_RESPONSE));

        verify(movementService).generateMovementsReport(
                eq(TEST_ACCOUNT_ID_ALL),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE));
    }

    @Test
    void generateReport_WithPDFFormat_ShouldReturnReport() throws Exception {
        when(movementService.generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_PDF),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE)))
                .thenReturn(TEST_REPORT_RESPONSE);

        mockMvc.perform(get("/api/movements/account/{accountId}/report", TEST_ACCOUNT_ID)
                .param("format", "PDF")
                .param("from", "2025-09-01")
                .param("to", "2025-09-30"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(TEST_REPORT_RESPONSE));

        verify(movementService).generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_PDF),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE));
    }

    @Test
    void generateReport_WithoutDates_ShouldReturnReportWithDefaultDates() throws Exception {
        when(movementService.generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(null),
                eq(null)))
                .thenReturn(TEST_REPORT_RESPONSE);

        mockMvc.perform(get("/api/movements/account/{accountId}/report", TEST_ACCOUNT_ID)
                .param("format", "JSON"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(TEST_REPORT_RESPONSE));

        verify(movementService).generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(null),
                eq(null));
    }

    @Test
    void generateReport_WithDefaultFormat_ShouldReturnJSONReport() throws Exception {
        when(movementService.generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE)))
                .thenReturn(TEST_REPORT_RESPONSE);

        mockMvc.perform(get("/api/movements/account/{accountId}/report", TEST_ACCOUNT_ID)
                .param("from", "2025-09-01")
                .param("to", "2025-09-30"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(TEST_REPORT_RESPONSE));

        verify(movementService).generateMovementsReport(
                eq(TEST_ACCOUNT_ID.toString()),
                eq(TEST_REPORT_FORMAT_JSON),
                eq(TEST_FROM_DATE),
                eq(TEST_TO_DATE));
    }
}