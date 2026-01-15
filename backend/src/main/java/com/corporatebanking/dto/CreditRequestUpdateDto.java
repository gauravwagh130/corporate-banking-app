package com.corporatebanking.dto;

import com.corporatebanking.model.CreditRequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreditRequestUpdateDto {
    @NotNull(message = "Status is required")
    private CreditRequestStatus status;
    @NotBlank
    private String remarks;
}
