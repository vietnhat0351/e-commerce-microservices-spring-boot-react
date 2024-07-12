package com.example.product.entities;

import lombok.*;

import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RAM extends Product {
    private String memoryType;
    private int speed;
    private String latency;
    private int capacity;
}
