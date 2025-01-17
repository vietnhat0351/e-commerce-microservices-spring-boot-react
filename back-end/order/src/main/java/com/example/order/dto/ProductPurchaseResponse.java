package com.example.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPurchaseResponse {
    private String productId;
    private String name;
    private int quantity;
    private double unitPrice;
}
