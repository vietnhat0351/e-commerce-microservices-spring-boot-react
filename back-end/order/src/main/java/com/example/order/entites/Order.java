package com.example.order.entites;

import com.example.order.enums.PaymentMethod;
import com.example.order.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "orders")
@Builder
public class Order {
    @Id
    private String id;
    private String customerId;
    private List<OrderItem> items;
    private PaymentMethod paymentMethod;
    private Address shippingAddress;
    private LocalDateTime createdAt;
    private double totalPrice;
    private OrderStatus status;
}
