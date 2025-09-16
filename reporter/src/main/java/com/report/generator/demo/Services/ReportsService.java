package com.report.generator.demo.Services;

import java.io.IOException;
import java.util.Map;

public interface ReportsService {

    String generatePdfReport(String templatePath,Map<String, Object> variables) throws IOException;
    String generateImageReport(String templatePath, Map<String, Object> variables) throws IOException;

}
