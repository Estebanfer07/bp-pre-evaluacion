package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.ClientState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CreateClientWithPersonDto extends CreatePersonDto {
    @NotBlank
    @Size(min = 8, max = 15)
    private String password;

    @NotNull
    private ClientState state;
}
