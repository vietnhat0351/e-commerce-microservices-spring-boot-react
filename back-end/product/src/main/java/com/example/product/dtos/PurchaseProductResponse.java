package com.example.product.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseProductResponse {
    private String productId;
    private String name;
    private int quantity;
    private double unitPrice;
}
