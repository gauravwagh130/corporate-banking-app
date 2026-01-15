package com.corporatebanking.service;

import com.corporatebanking.dto.CreditRequestEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${spring.kafka.topic.credit-request-events}")
    private String creditRequestTopic;

    public void publishCreditRequestEvent(CreditRequestEvent event) {
        try {
            CompletableFuture<SendResult<String, Object>> future =
                    kafkaTemplate.send(creditRequestTopic, event.getCreditRequestId(), event);

            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log. info(" Published Kafka Event: {} for Credit Request ID: {}",
                            event.getEventType(), event.getCreditRequestId());
                    log.info(" Event Details: Topic={}, Partition={}, Offset={}",
                            result.getRecordMetadata().topic(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    log.error(" Failed to publish Kafka event: {}", ex.getMessage());
                }
            });
        } catch (Exception e) {
            log.error("Error publishing Kafka event: {}", e.getMessage(), e);
        }
    }
}