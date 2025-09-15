package com.esterodr.service.dto;

import com.esterodr.domain.enums.Gender;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class UpdatePersonDto {
    private String name;
    private Gender gender;

    @PositiveOrZero
    private Integer age;
    private String identification;
    private String address;
    private String phone;
}
