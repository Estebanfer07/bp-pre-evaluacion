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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JsonReportStrategyTest {

    private JsonReportStrategy jsonReportStrategy;
    private Account testAccount;
    private List<Movements> testMovements;

    @BeforeEach
    void setUp() {
        jsonReportStrategy = new JsonReportStrategy();

        Person testPerson = Person.builder()
                .id(UUID.randomUUID())
                .name("John Doe")
                .identification("1234567890")
                .address("123 Test Street")
                .phone("555-0123")
                .gender(Gender.MALE)
                .age(30)
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
                .type(AccountType.AHO)
                .balance(1000.0)
                .state(AccountState.ACTIVE)
                .client(testClient)
                .build();

        Movements movement1 = Movements.builder()
                .id(UUID.randomUUID())
                .accountId(testAccount.getId())
                .account(testAccount)
                .movementType(MovementType.DEPOSIT)
                .amount(500.0)
                .balance(1500.0)
                .date(LocalDateTime.now())
                .build();

        Movements movement2 = Movements.builder()
                .id(UUID.randomUUID())
                .accountId(testAccount.getId())
                .account(testAccount)
                .movementType(MovementType.WITHDRAWAL)
                .amount(-200.0)
                .balance(1300.0)
                .date(LocalDateTime.now())
                .build();

        testMovements = Arrays.asList(movement1, movement2);
    }

    @Test
    void generateReport_ShouldReturnJsonReport() {
        Object result = jsonReportStrategy.generateReport(testMovements, testAccount, LocalDate.now(), LocalDate.now());

        assertNotNull(result);
        assertTrue(result instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> reportMap = (Map<String, Object>) result;
        assertTrue(reportMap.containsKey("jsonReport"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> movementsList = (List<Map<String, Object>>) reportMap.get("jsonReport");
        
        assertNotNull(movementsList);
        assertEquals(2, movementsList.size());

        Map<String, Object> firstMovement = movementsList.get(0);
        assertNotNull(firstMovement.get("id"));
        assertEquals(500.0, firstMovement.get("amount"));
        assertEquals(MovementType.DEPOSIT.toString(), firstMovement.get("type"));
        assertEquals("123456789012", firstMovement.get("accountNumber"));
        assertEquals("John Doe", firstMovement.get("clientName"));
        assertEquals("1234567890", firstMovement.get("clientId"));
    }

    @Test
    void generateReport_WithNullAccount_ShouldHandleGracefully() {
        Object result = jsonReportStrategy.generateReport(testMovements, null, LocalDate.now(), LocalDate.now());

        assertNotNull(result);
        assertTrue(result instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> reportMap = (Map<String, Object>) result;
        assertTrue(reportMap.containsKey("jsonReport"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> movementsList = (List<Map<String, Object>>) reportMap.get("jsonReport");
        
        assertNotNull(movementsList);
        assertEquals(2, movementsList.size());
    }

    @Test
    void generateReport_WithEmptyMovements_ShouldReturnEmptyList() {
        Object result = jsonReportStrategy.generateReport(Arrays.asList(), testAccount, LocalDate.now(), LocalDate.now());

        assertNotNull(result);
        assertTrue(result instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> reportMap = (Map<String, Object>) result;

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> movementsList = (List<Map<String, Object>>) reportMap.get("jsonReport");
        
        assertNotNull(movementsList);
        assertTrue(movementsList.isEmpty());
    }
}