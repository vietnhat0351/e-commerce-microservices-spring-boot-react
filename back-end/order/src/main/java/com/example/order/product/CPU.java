package com.example.order.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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
