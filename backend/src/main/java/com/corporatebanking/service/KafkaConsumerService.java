package com.corporatebanking.service;

import com.corporatebanking.dto.CreditRequestEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    @KafkaListener(
            topics = "${spring.kafka.topic.credit-request-events}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consumeCreditRequestEvent(
            @Payload CreditRequestEvent event,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        try {
            log.info("""
                    
                    ===================== KAFKA EVENT RECEIVED =====================
                    Topic           : {}
                    Partition       : {}
                    Offset          : {}
                    ---------------------------------------------------------------
                    Event Type      : {}
                    CreditRequestId : {}
                    ClientId        : {}
                    Submitted By    : {}
                    Amount          : {}
                    Tenure (Months) : {}
                    Purpose         : {}
                    Status          : {}
                    Remarks         : {}
                    Updated By      : {}
                    Timestamp       : {}
                    ===============================================================
                    """,
                    topic,
                    partition,
                    offset,
                    event.getEventType(),
                    event.getCreditRequestId(),
                    event.getClientId(),
                    event.getSubmittedBy(),
                    event.getRequestAmount(),
                    event.getTenureMonths(),
                    event.getPurpose(),
                    event.getStatus(),
                    event.getRemarks(),
                    event.getUpdatedBy(),
                    event.getTimestamp()
            );

        } catch (Exception e) {
            log.error("Kafka event processing failed | topic={} | offset={} | error={}",
                    topic, offset, e.getMessage(), e);
        }
    }
}
