package com.example.order.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private ProductCategory category;
    private String image;
    private String manufacturer;
}
