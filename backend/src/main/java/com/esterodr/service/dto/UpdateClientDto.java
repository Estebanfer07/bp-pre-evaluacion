package com.esterodr.service.dto;

import com.esterodr.domain.enums.ClientState;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateClientDto {
    @Size(min = 8, max = 15)
    private String password;
    private ClientState state;
}
