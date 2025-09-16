package com.esterodr.backend.service.dto;

import com.esterodr.backend.domain.enums.Gender;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePersonDto {
    private String name;
    private Gender gender;

    @PositiveOrZero
    private Integer age;
    private String identification;
    private String address;
    private String phone;
}
