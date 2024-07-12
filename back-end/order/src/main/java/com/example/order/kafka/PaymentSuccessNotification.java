package com.example.order.kafka;

import com.example.order.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSuccessNotification {
    private String id;
    private String orderId;
    private Customer customer;
    private PaymentMethod paymentMethod;
    private double amount;
    private LocalDateTime createdDate;
}