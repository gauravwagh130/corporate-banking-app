package com.corporatebanking.dto;

import com.corporatebanking.model.PrimaryContact;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ClientResponseDto {

    private String id;
    private String companyName;
    private String industry;
    private String address;
    private PrimaryContact primaryContact;
    private Double annualTurnover;
    private boolean documentsSubmitted;
}
