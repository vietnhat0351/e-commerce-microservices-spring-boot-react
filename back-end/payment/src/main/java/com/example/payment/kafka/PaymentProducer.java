package com.example.payment.kafka;

import com.example.payment.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentProducer {

    private final KafkaTemplate<String, PaymentSuccessNotification> kafkaTemplate;

    public void sendPaymentSuccessMessage(PaymentSuccessNotification paymentSuccessNotification) {
        log.info("Sending payment success message");
        Message<PaymentSuccessNotification> message = MessageBuilder
                .withPayload(paymentSuccessNotification)
                .setHeader(KafkaHeaders.TOPIC, "payment-topic")
                .build();
        kafkaTemplate.send(message);
    }
}
