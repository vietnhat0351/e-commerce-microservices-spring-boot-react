package com.example.order.dto.fullOrder;

import com.example.order.enums.PaymentMethod;
import com.example.order.entites.Address;
import com.example.order.enums.OrderStatus;
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
public class FullOrder {
    private String id;
    private User customer;
    private List<OrderItem> items;
    private PaymentMethod paymentMethod;
    private Address shippingAddress;
    private LocalDateTime createdAt;
    private double totalPrice;
    private OrderStatus status;
}


