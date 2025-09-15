package com.esterodr.backend.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        logger.warn("Invalid request params at {}: {}", request.getDescription(false), errors);
        Map<String, String> body = new HashMap<>();
        body.put("error", "Invalid request parameters");
        body.put("details", "One or more fields are invalid.");
        body.put("fields", String.join(", ", errors.keySet()));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
            HttpServletRequest request) {
        String field = null;
        Throwable cause = ex.getCause();
        if (cause != null && cause.getMessage() != null) {
            int idx = cause.getMessage().indexOf("[\"");
            int endIdx = cause.getMessage().indexOf("\"]");
            if (idx != -1 && endIdx != -1 && endIdx > idx) {
                field = cause.getMessage().substring(idx + 2, endIdx);
            }
        }
        logger.warn("Invalid request body at uri={}: {} (field: {})", request.getRequestURI(), ex.getMessage(), field);
        Map<String, String> body = new HashMap<>();
        body.put("error", "Malformed request body");
        if (field != null) {
            body.put("details", "The request could not be processed. Invalid value for field: " + field);
            body.put("field", field);
        } else {
            body.put("details", "The request could not be processed. Please check your input data.");
        }
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        logger.error("Exception at {}: {}", request.getDescription(false), ex.getMessage(), ex);
        Map<String, String> body = new HashMap<>();
        body.put("error", "Internal server error");
        body.put("details", "An unexpected error occurred.");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
