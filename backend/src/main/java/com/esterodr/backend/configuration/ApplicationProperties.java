package com.esterodr.backend.configuration;

import static lombok.AccessLevel.PRIVATE;
import static lombok.AccessLevel.PUBLIC;

import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "my-bank")
@FieldDefaults(level = PRIVATE)
public class ApplicationProperties {

    Encryption encryption;
    PdfService pdfService;

    @Data
    @FieldDefaults(level = PUBLIC)
    public static class Encryption {
        String secretKey;
    }

    @Data
    @FieldDefaults(level = PUBLIC)
    public static class PdfService {
        String url;
    }

}
