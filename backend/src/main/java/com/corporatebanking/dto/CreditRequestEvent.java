package com.corporatebanking.dto;

import com.corporatebanking.model.CreditRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time. Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditRequestEvent {
    private String eventType; // "CREDIT_REQUEST_CREATED" or "CREDIT_REQUEST_STATUS_UPDATED"
    private String creditRequestId;
    private String clientId;
    private String submittedBy;
    private Long requestAmount;
    private Integer tenureMonths;
    private String purpose;
    private CreditRequestStatus status;
    private String remarks;
    private Instant timestamp;
    private String updatedBy; // For status updates
}