package com.corporatebanking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class CreditRequestRequestDto {
    @NotBlank(message = "clientId is required")
    private String clientId;

    @NotNull(message = "requestAmount is required")
    @Min(value = 1, message = "requestAmount must be > 0")
    private Long requestAmount;

    @NotNull(message = "tenureMonths is required")
    @Min(value = 1, message = "tenureMonths must be > 0")
    private Integer tenureMonths;

    @NotBlank(message = "purpose is required")
    private String purpose;


}
