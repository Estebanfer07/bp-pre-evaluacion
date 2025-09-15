package com.esterodr.backend.service.dto;

import java.util.UUID;

import com.esterodr.backend.domain.enums.ClientState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateClientDto {
    @NotNull
    private UUID personId;

    @NotBlank
    @Size(min = 8, max = 15)
    private String password;

    @NotNull
    private ClientState state;
}
