package com.example.order.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderStatusRequest {
    @NotNull(message = "Order id is required")
    @NotEmpty(message = "Order id is required")
    private String orderId;
    @NotNull(message = "Status is required")
    @NotEmpty(message = "Status is required")
    private String status;
}
