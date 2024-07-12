package com.example.order.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    private String productId;
    private String name;
    private String image;
    private int quantity;
    private double price;
}
