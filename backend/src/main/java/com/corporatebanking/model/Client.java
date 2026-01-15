package com.corporatebanking.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "clients")
public class Client {
    @Id
    private String id;
    @NotBlank
    private String companyName;
    @NotBlank
    private String industry;
    @NotBlank
    private String address;
    @Valid
    private PrimaryContact primaryContact;
    @Positive
    private double annualTurnover;
    private boolean documentsSubmitted;
    @NotBlank
    private String rmId;


}
