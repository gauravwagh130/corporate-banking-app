package com.corporatebanking.dto;

import com.corporatebanking.model.PrimaryContact;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRequestDto {

    @NotBlank
    private String companyName;

    @NotBlank
    private String industry;

    private String address;

    @Valid
    private PrimaryContact primaryContact;

    @Positive
    private Double annualTurnover;

    private boolean documentsSubmitted;
}
