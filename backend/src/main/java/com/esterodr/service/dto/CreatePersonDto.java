package com.esterodr.service.dto;

import com.esterodr.domain.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
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
