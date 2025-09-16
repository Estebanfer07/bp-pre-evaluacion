package com.report.generator.demo.Controllers;

import com.report.generator.demo.Services.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    @PostMapping(value = "/pdf/{templatePath}")
    public String getPdfReport(@RequestBody Map<String, Object> body, @PathVariable String templatePath) throws IOException {
        return reportsService.generatePdfReport(templatePath, body);
    }

    @PostMapping(value = "/image/{templatePath}")
    public String getImageReport(@RequestBody Map<String, Object> body, @PathVariable String templatePath) throws IOException {
        return reportsService.generateImageReport(templatePath, body );
    }
}
