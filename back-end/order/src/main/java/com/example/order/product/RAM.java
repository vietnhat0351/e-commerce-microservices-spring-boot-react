package com.example.order.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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
