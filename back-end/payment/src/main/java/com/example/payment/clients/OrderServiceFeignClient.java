package com.example.payment.clients;

import com.example.payment.kafka.Customer;
import com.example.payment.order.Order;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@FeignClient(name = "order-service", url = "${feign.client.order-service.url}")
public interface OrderServiceFeignClient {
    @GetMapping("/{id}")
    Order getOrder(@PathVariable String id);

    @PutMapping("/update-status")
    ResponseEntity<Order> updateOrderStatus(@RequestParam String orderId, @RequestParam String status);

    @GetMapping("/get-customer-from-order/{orderId}")
    Customer getCustomerFromOrder(@PathVariable String orderId);
}
