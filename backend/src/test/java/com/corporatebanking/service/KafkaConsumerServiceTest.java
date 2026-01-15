package com.corporatebanking.service;

import com.corporatebanking.dto.CreditRequestEvent;
import com.corporatebanking.model.CreditRequestStatus;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class KafkaConsumerServiceTest {

    private final KafkaConsumerService kafkaConsumerService =
            new KafkaConsumerService();

    @Test
    void consumeCreditRequestEvent_shouldNotThrowException() {

        CreditRequestEvent event = new CreditRequestEvent(
                "CREDIT_REQUEST_CREATED",
                "cr1",
                "client1",
                "rm1",
                500000L,
                12,
                "Business Expansion",
                CreditRequestStatus.PENDING,
                "",
                Instant.now(),
                null
        );

        assertDoesNotThrow(() ->
                kafkaConsumerService.consumeCreditRequestEvent(
                        event,
                        "credit-request-events",
                        0,
                        10L
                )
        );
    }
}
