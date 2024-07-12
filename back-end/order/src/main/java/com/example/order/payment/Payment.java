package com.example.order.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Payment {
    private String id;
    private String orderId;
    private PaymentMethod paymentMethod;
    private double amount;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}
