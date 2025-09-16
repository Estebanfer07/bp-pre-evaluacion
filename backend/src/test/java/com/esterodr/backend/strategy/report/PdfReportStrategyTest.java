package com.esterodr.backend.strategy.report;

import com.esterodr.backend.domain.Account;
import com.esterodr.backend.domain.Client;
import com.esterodr.backend.domain.Movements;
import com.esterodr.backend.domain.Person;
import com.esterodr.backend.domain.enums.AccountState;
import com.esterodr.backend.domain.enums.AccountType;
import com.esterodr.backend.domain.enums.ClientState;
import com.esterodr.backend.domain.enums.Gender;
import com.esterodr.backend.domain.enums.MovementType;
import com.esterodr.backend.repository.PdfRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("unchecked")
class PdfReportStrategyTest {

    @Mock
    private PdfRepository pdfRepository;

    @InjectMocks
    private PdfReportStrategy pdfReportStrategy;

    private Account testAccount;
    private List<Movements> testMovements;

    @BeforeEach
    void setUp() {
        Person testPerson = Person.builder()
                .id(UUID.randomUUID())
                .name("Jane Smith")
                .identification("9876543210")
                .address("456 Another Street")
                .phone("555-9876")
                .gender(Gender.FEMALE)
                .age(28)
                .build();

        Client testClient = Client.builder()
                .id(UUID.randomUUID())
                .password("password")
                .state(ClientState.ACTIVE)
                .person(testPerson)
                .build();

        testAccount = Account.builder()
                .id(UUID.randomUUID())
                .accountNumber("123456789012")
                .type(AccountType.CTE)
                .balance(2000.0)
                .state(AccountState.ACTIVE)
                .client(testClient)
                .build();

        Movements movement1 = Movements.builder()
                .id(UUID.randomUUID())
                .accountId(testAccount.getId())
                .account(testAccount)
                .movementType(MovementType.DEPOSIT)
                .amount(300.0)
                .balance(2300.0)
                .date(LocalDateTime.now())
                .build();

        Movements movement2 = Movements.builder()
                .id(UUID.randomUUID())
                .accountId(testAccount.getId())
                .account(testAccount)
                .movementType(MovementType.WITHDRAWAL)
                .amount(-150.0)
                .balance(2150.0)
                .date(LocalDateTime.now())
                .build();

        testMovements = Arrays.asList(movement1, movement2);
    }

    @Test
    void generateReport_ShouldReturnPdfReport() {
        String testBase64Pdf = "JVBERi0xLjQKJdPr6eEKMSAwIG9iago=";
        when(pdfRepository.generatePdfReport(any(Map.class))).thenReturn(testBase64Pdf);

        Object result = pdfReportStrategy.generateReport(testMovements, testAccount, LocalDate.now(), LocalDate.now());

        assertNotNull(result);
        assertTrue(result instanceof Map);

        Map<String, String> resultMap = (Map<String, String>) result;
        assertTrue(resultMap.containsKey("pdfReport"));
        assertEquals(testBase64Pdf, resultMap.get("pdfReport"));

        verify(pdfRepository).generatePdfReport(any(Map.class));
    }

    @Test
    void generateReport_WithNullAccount_ShouldGenerateAllAccountsReport() {
        String testBase64Pdf = "JVBERi0xLjQKJdPr6eEKMSAwIG9iago=";
        when(pdfRepository.generatePdfReport(any(Map.class))).thenReturn(testBase64Pdf);

        Object result = pdfReportStrategy.generateReport(testMovements, null, LocalDate.now(), LocalDate.now());

        assertNotNull(result);
        assertTrue(result instanceof Map);

        Map<String, String> resultMap = (Map<String, String>) result;
        assertTrue(resultMap.containsKey("pdfReport"));
        assertEquals(testBase64Pdf, resultMap.get("pdfReport"));

        verify(pdfRepository).generatePdfReport(any(Map.class));
    }

    @Test
    void generateReport_WhenPdfRepositoryThrowsException_ShouldThrowRuntimeException() {
        when(pdfRepository.generatePdfReport(any(Map.class)))
                .thenThrow(new RuntimeException("PDF generation failed"));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> pdfReportStrategy.generateReport(testMovements, testAccount, LocalDate.now(), LocalDate.now()));

        assertTrue(exception.getMessage().contains("Failed to generate PDF report"));
        assertTrue(exception.getMessage().contains("PDF generation failed"));
    }
}