package com.example.order.dto.orderRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestItem {
    @NotNull(message = "Product ID is required")
    @NotEmpty(message = "Product ID is required")
    private String id;
    @Positive(message = "Quantity must be greater than 0")
    @NotNull(message = "Quantity is required")
    private int quantity;
}
