package com.example.order.dto.orderRequest;

import com.example.order.entites.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    @NotEmpty(message = "User ID is required")
    @NotNull(message = "User ID is required")
    private String userId;

    @NotNull(message = "Order items are required")
    @NotEmpty(message = "Order items are required")
    @Valid
    private List<OrderRequestItem> orderItems;

    @NotNull(message = "Payment method is required")
    @NotEmpty(message = "Payment method is required")
    private String paymentMethod;

    @NotNull(message = "Shipping address is required")
    @NotEmpty(message = "Shipping address is required")
    private String addressId;
}

