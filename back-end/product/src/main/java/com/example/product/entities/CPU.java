package com.example.product.entities;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CPU extends Product {
    private String socket;
    private String series;
    private int core;
    private int thread;
    private String baseClock;
    private String boostClock;
    private String tdp;
    private String cache;
}
