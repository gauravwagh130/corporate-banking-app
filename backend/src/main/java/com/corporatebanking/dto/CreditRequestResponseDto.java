package com.corporatebanking.dto;

import com.corporatebanking.model.CreditRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreditRequestResponseDto {
    private String id;
    private String clientId;
    private String submittedBy;
    private Long requestAmount;
    private Integer tenureMonths;
    private String purpose;
    private CreditRequestStatus status;
    private String remarks;
    private Instant createdAt;

}
