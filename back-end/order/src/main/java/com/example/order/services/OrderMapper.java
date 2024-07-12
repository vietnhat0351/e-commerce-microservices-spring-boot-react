package com.example.order.services;

import com.example.order.dto.orderRequest.OrderRequest;
import com.example.order.dto.ProductPurchaseResponse;
import com.example.order.entites.Address;
import com.example.order.entites.Order;
import com.example.order.entites.OrderItem;
import com.example.order.enums.OrderStatus;
import com.example.order.enums.PaymentMethod;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrderMapper {

    public Order mapToOrder(OrderRequest request, List<ProductPurchaseResponse> productPurchaseResponses, Address shippingAddress) {
        Map<String, ProductPurchaseResponse> productPurchaseResponseMap = productPurchaseResponses.stream()
                .collect(Collectors.toMap(ProductPurchaseResponse::getProductId, Function.identity()));
        return Order.builder()
                .customerId(request.getUserId())
                .items(request.getOrderItems().stream().map(item -> OrderItem.builder()
                        .productId(item.getId())
                        .quantity(item.getQuantity())
                        .build()
                        ).toList())
                .createdAt(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")))
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .shippingAddress(shippingAddress)
                .status(OrderStatus.PENDING)
                .totalPrice(request.getOrderItems().stream().mapToDouble(item -> item.getQuantity() * productPurchaseResponseMap.get(item.getId()).getUnitPrice()).sum())
                .build();
    }
}
