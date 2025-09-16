package com.esterodr.backend.repository;

import com.esterodr.backend.configuration.ApplicationProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PdfRepository {

    private final RestTemplate restTemplate;
    private final ApplicationProperties applicationProperties;

    public String generatePdfReport(Map<String, Object> pdfData) {
        try {
            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create request entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(pdfData, headers);

            // Call the PDF service
            ResponseEntity<String> response = restTemplate.exchange(
                    applicationProperties.getPdfService().getUrl(),
                    HttpMethod.POST,
                    requestEntity,
                    String.class);

            log.info("PDF service call successful, received response");
            return response.getBody();

        } catch (Exception e) {
            log.error("Error calling PDF service: {}", e.getMessage());
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage());
        }
    }
}