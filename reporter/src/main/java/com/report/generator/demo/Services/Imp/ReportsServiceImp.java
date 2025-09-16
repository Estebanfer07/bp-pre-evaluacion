package com.report.generator.demo.Services.Imp;

import com.report.generator.demo.Services.ReportsService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class ReportsServiceImp implements ReportsService {

    private static final String FONT_PATH = "/static/fonts/PlaywriteSK-VariableFont_wght.ttf";
    private static final String IMAGE_PATH = "src/main/resources/base64Assets/";
    private static final String HTML_PATH = "src/main/resources/templates/";

    private static Map<String, String> obtainAssets(Map<String, String> assets) throws IOException {

        for (Map.Entry<String, String> entry : assets.entrySet()) {
            FileInputStream fis = new FileInputStream(IMAGE_PATH.concat(entry.getValue()
                    .concat(".txt")));
            String IMAGE = IOUtils.toString(fis, "UTF-8");
            assets.replace(entry.getKey(), IMAGE);
        }

        return assets;
    }

    private static String getHtmlContent(String templatePath, Map<String, Object> vars) throws IOException {

        ClassPathResource resource = new ClassPathResource("templates/" + templatePath + ".html");
        String html = IOUtils.toString(resource.getInputStream(), "UTF-8");
        return mapVariablesInHtml(html, vars, "");
    }

    private static String mapVariablesInHtml(String html, Map<String, Object> vars, String context) throws IOException {
        if (vars.containsKey("assets") && vars.get("assets") instanceof Map) {
            Map<String, String> assets = obtainAssets((Map<String, String>) vars.get("assets"));
            vars.remove("assets");
            vars.putAll(assets);
        }
        for (Map.Entry<String, Object> entry : vars.entrySet()) {
            if (entry.getValue() instanceof String || entry.getValue() instanceof Number) {
                String currentContext = StringUtils.isEmpty(context) ? entry.getKey()
                        : String.format("%s\\.%s", context, entry.getKey());
                String placeholder = "\\{\\{" + currentContext + "\\}\\}";
                html = html.replaceAll(placeholder, entry.getValue()
                        .toString());
            }
            if (entry.getValue() instanceof ArrayList) {
                try {
                    Pattern arrayPattern = Pattern.compile(
                            "\\{\\{" + entry.getKey() + "\\}\\}(.+?)\\{\\{" + entry.getKey() + "\\}\\}",
                            Pattern.DOTALL);
                    Matcher matcher = arrayPattern.matcher(html);
                    StringBuffer arrayBuffer = new StringBuffer();

                    while (matcher.find()) {
                        String itemSection = matcher.group(1)
                                .trim();

                        StringBuilder modifiedSection = new StringBuilder();

                        for (Object item : (ArrayList<Object>) entry.getValue()) {
                            if (item instanceof String || item instanceof Number) {
                                String itemPlaceholder = String.format("\\{\\{%s\\.Item\\}\\}", entry.getKey()); // {{myArray.Item}}
                                modifiedSection.append(itemSection.replaceAll(itemPlaceholder, item.toString()));
                            }
                            if (item instanceof Map) {
                                modifiedSection.append(mapVariablesInHtml(itemSection, (Map<String, Object>) item,
                                        StringUtils.isEmpty(context) ? entry.getKey()
                                                : String.format("%s.%s", context, entry.getKey())));
                            }
                        }
                        matcher.appendReplacement(arrayBuffer, Matcher.quoteReplacement(modifiedSection.toString()));
                        matcher.appendTail(arrayBuffer);
                        html = arrayBuffer.toString();
                    }

                } catch (Exception ignored) {
                }
            }
        }

        html = processConditionals(html, vars, context);
        return html;
    }

    private static String processConditionals(String html, Map<String, Object> vars, String context) {
        Pattern pattern = Pattern.compile("\\{\\{if (.+?)\\}\\}(.+?)\\{\\{endif\\}\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(html);
        StringBuffer buffer = new StringBuffer();

        while (matcher.find()) {
            String condition = matcher.group(1)
                    .trim();
            String content = matcher.group(2);
            boolean conditionMet = evaluateCondition(condition, vars, context);
            matcher.appendReplacement(buffer, conditionMet ? Matcher.quoteReplacement(content) : "");
        }
        matcher.appendTail(buffer);
        return buffer.toString();
    }

    private static boolean evaluateCondition(String condition, Map<String, Object> vars, String context) {
        String currentContext = StringUtils.isEmpty(context) ? "" : context.concat(".");
        String[] tokens = condition.split(" ");
        if (tokens.length == 3) {
            String varName = tokens[0].replace(currentContext, "");
            String operator = tokens[1];
            String value = tokens[2];
            Object varValue = vars.get(varName);

            if (varValue != null) {
                switch (operator) {
                    case "!==":
                        return !varValue.toString()
                                .equals(value);
                    case "===":
                        return varValue.toString()
                                .equals(value);
                }
            }
        }
        return false;
    }

    public String generatePdfReport(String templatePath, Map<String, Object> variables) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream();

        try {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(getHtmlContent(templatePath, variables));

            // Register the font
            renderer.getFontResolver()
                    .addFont(FONT_PATH, "UTF-8", true);

            renderer.layout();
            renderer.createPDF(os);

            // Encode PDF bytes to Base64
            byte[] pdfBytes = os.toByteArray();

            return java.util.Base64.getEncoder()
                    .encodeToString(pdfBytes);
        } finally {
            os.close();
        }
    }

    public String generateImageReport(String templatePath, Map<String, Object> variables) throws IOException {
        // Step 1: Generate the PDF and get the byte array
        String base64Pdf = generatePdfReport(templatePath, variables);
        byte[] pdfBytes = java.util.Base64.getDecoder()
                .decode(base64Pdf);

        // Step 2: Convert PDF to image
        PDDocument document = PDDocument.load(pdfBytes);
        PDFRenderer pdfRenderer = new PDFRenderer(document);

        // Render the first page to an image
        BufferedImage bim = pdfRenderer.renderImageWithDPI(0, 300, ImageType.RGB);
        document.close();

        // Step 3: Encode the BufferedImage to Base64
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(bim, "png", os);
        byte[] imageBytes = os.toByteArray();
        return java.util.Base64.getEncoder()
                .encodeToString(imageBytes);
    }
}
