package com.example.notification.kafka;

import com.example.notification.email.EmailService;
import com.example.notification.order.OrderConfirmation;
import com.example.notification.payment.Payment;
import com.example.notification.payment.PaymentSuccessNotification;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final EmailService emailService;

    @KafkaListener(topics = "order-topic", groupId = "notificationGroup")
    public void consumeOrderNotification(OrderConfirmation orderConfirmation) throws MessagingException {
        log.info("Consuming order confirmation: " + orderConfirmation);
        emailService.sendOrderConfirmation(orderConfirmation);
    }

    @KafkaListener(topics = "payment-topic", groupId = "notificationGroup")
    public void consumePaymentSuccess(PaymentSuccessNotification paymentSuccessNotification) throws MessagingException {
        log.info("Consuming payment success: " + paymentSuccessNotification);
        emailService.sendPaymentSuccess(paymentSuccessNotification);
    }
}
