package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.ClientState;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UpdateClientWithPersonDto extends UpdatePersonDto {
    @Size(min = 8, max = 15)
    private String password;
    private ClientState state;
}
