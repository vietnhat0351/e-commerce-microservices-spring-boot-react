package com.example.product.entities;

import com.example.product.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "products")
public class Product implements Serializable {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private ProductCategory category;
    private String image;
    private String manufacturer;
}
