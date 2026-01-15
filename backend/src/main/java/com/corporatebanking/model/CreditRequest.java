package com.corporatebanking.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "creditRequests")
public class CreditRequest {
    @Id
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
