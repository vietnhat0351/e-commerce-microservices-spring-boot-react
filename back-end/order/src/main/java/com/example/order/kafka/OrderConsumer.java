package com.example.order.kafka;

import com.example.order.entites.Order;
import com.example.order.enums.OrderStatus;
import com.example.order.payment.Payment;
import com.example.order.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderConsumer {

    private final OrderService orderService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @KafkaListener(topics = "payment-topic", groupId = "orderGroup")
    public void consumePaymentSuccess(PaymentSuccessNotification paymentSuccessNotification) {
        log.info("Consuming payment success: " + paymentSuccessNotification);
        orderService.updateOrderStatus(paymentSuccessNotification.getOrderId(), OrderStatus.PAID.name());
        // send notification to to topic new-order
        List<Order> paidOrder = orderService.getPaidOrders();
        simpMessagingTemplate.convertAndSend("/topic/new-order", paidOrder);
    }

}
