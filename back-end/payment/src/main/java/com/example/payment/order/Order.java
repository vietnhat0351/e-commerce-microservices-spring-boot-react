package com.example.payment.order;

import com.example.payment.order.enums.OrderStatus;
import com.example.payment.order.enums.PaymentMethod;
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
public class Order {
    private String id;
    private String customerId;
    private List<OrderItem> items;
    private PaymentMethod paymentMethod;
    private Address shippingAddress;
    private LocalDateTime createdAt;
    private double totalPrice;
    private OrderStatus status;
}
