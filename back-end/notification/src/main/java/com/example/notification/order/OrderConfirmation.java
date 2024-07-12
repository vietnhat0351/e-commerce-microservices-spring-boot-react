package com.example.notification.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderConfirmation {
    private String id;
    private Customer customer;
    private List<OrderItem> items;
    private PaymentMethod paymentMethod;
    private Address shippingAddress;
    private LocalDateTime createdAt;
    private double totalPrice;
    private OrderStatus status;
}

