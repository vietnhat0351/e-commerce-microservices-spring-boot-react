package com.example.product.entities;

import com.example.product.ProductCategory;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GPU extends Product {
    private String graphicsProcessingUnit;
    private String brand;
    private int memory;
    private String memoryType;

    public GPU(String id, String name, String description, double price, int stock, ProductCategory category, String image, String manufacturer, String graphicsProcessingUnit, String brand, int memory, String memoryType) {
        super(id, name, description, price, stock, category, image, manufacturer);
        this.graphicsProcessingUnit = graphicsProcessingUnit;
        this.brand = brand;
        this.memory = memory;
        this.memoryType = memoryType;
    }
}
