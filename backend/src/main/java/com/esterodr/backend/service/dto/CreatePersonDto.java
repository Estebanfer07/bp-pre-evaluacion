package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePersonDto {
    @NotBlank
    private String name;

    @NotNull
    private Gender gender;

    @NotNull
    @PositiveOrZero
    private Integer age;

    @NotBlank
    private String identification;

    @NotNull
    private String address;

    @NotNull
    private String phone;
}
