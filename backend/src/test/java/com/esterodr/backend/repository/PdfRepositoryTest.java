package com.esterodr.backend.repository;

import com.esterodr.backend.configuration.ApplicationProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PdfRepositoryTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private ApplicationProperties.PdfService pdfService;

    @InjectMocks
    private PdfRepository pdfRepository;

    private static final String TEST_PDF_SERVICE_URL = "http://localhost:3000/generate-pdf";
    private static final String TEST_BASE64_PDF_RESPONSE = "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PA==";

    private Map<String, Object> testPdfData;

    @BeforeEach
    void setUp() {
        when(applicationProperties.getPdfService()).thenReturn(pdfService);
        when(pdfService.getUrl()).thenReturn(TEST_PDF_SERVICE_URL);

        testPdfData = new HashMap<>();
        testPdfData.put("title", "Account Movement Report");
        testPdfData.put("clientName", "John Doe");
    }

    @Test
    void generatePdfReport_ShouldReturnBase64Pdf() {
        ResponseEntity<String> mockResponse = new ResponseEntity<>(TEST_BASE64_PDF_RESPONSE, HttpStatus.OK);
        when(restTemplate.exchange(
                eq(TEST_PDF_SERVICE_URL),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)))
                .thenReturn(mockResponse);

        String result = pdfRepository.generatePdfReport(testPdfData);

        assertNotNull(result);
        assertEquals(TEST_BASE64_PDF_RESPONSE, result);
        verify(restTemplate).exchange(
                eq(TEST_PDF_SERVICE_URL),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class));
    }

    @Test
    void generatePdfReport_WhenRestTemplateThrowsException_ShouldThrowRuntimeException() {
        when(restTemplate.exchange(
                eq(TEST_PDF_SERVICE_URL),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)))
                .thenThrow(new RestClientException("Connection timeout"));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> pdfRepository.generatePdfReport(testPdfData));

        assertTrue(exception.getMessage().contains("Failed to generate PDF report"));
        assertTrue(exception.getMessage().contains("Connection timeout"));
    }

    @Test
    void generatePdfReport_WithNullData_ShouldHandleGracefully() {
        ResponseEntity<String> mockResponse = new ResponseEntity<>(TEST_BASE64_PDF_RESPONSE, HttpStatus.OK);
        when(restTemplate.exchange(
                eq(TEST_PDF_SERVICE_URL),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)))
                .thenReturn(mockResponse);

        String result = pdfRepository.generatePdfReport(null);

        assertNotNull(result);
        assertEquals(TEST_BASE64_PDF_RESPONSE, result);
    }
}