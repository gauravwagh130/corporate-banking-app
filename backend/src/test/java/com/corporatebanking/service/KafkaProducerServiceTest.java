package com.corporatebanking.service;

import com.corporatebanking.dto.CreditRequestEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class KafkaProducerServiceTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private KafkaProducerService kafkaProducerService;

    @Test
    void publishCreditRequestEvent_shouldSendEventToKafka() {

        // Arrange
        CreditRequestEvent event = new CreditRequestEvent(
                "CREDIT_REQUEST_CREATED",
                "cr1",
                "client1",
                "rm1",
                100000L,
                12,
                "Expansion",
                null,
                "",
                Instant.now(),
                null
        );

        CompletableFuture<SendResult<String, Object>> future =
                CompletableFuture.completedFuture(mock(SendResult.class));

        when(kafkaTemplate.send(anyString(), anyString(), any()))
                .thenReturn(future);

        // set @Value field manually
        ReflectionTestUtils.setField(
                kafkaProducerService,
                "creditRequestTopic",
                "credit-request-events"
        );

        // Act
        kafkaProducerService.publishCreditRequestEvent(event);

        // Assert
        verify(kafkaTemplate, times(1))
                .send("credit-request-events", "cr1", event);
    }
}
