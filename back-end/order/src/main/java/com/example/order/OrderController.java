package com.example.order;

import com.example.order.clients.UserFeignClient;
import com.example.order.dto.UpdateOrderStatusRequest;
import com.example.order.dto.orderRequest.OrderRequest;
import com.example.order.dto.fullOrder.FullOrder;
import com.example.order.entites.Order;
import com.example.order.kafka.Customer;
import com.example.order.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserFeignClient userFeignClient;

    @GetMapping("/get-total-quantity")
    public int getTotalOrderQuantity() {
        return orderService.getTotalOrderQuantity();
    }

    @PostMapping("/create")
    public Order createOrder(@Valid @RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable String id) {
        return orderService.getOrder(id);
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/fullOrdersByUserId")
    public List<FullOrder> getFullOrdersByUserId(@RequestParam String userId) {
        return orderService.getFullOrdersByUserId(userId);
    }

    @GetMapping("/fullOrders")
    public List<FullOrder> getFullOrders() {
        return orderService.getFullOrders();
    }

    @GetMapping("/fullOrder/{orderId}")
    public FullOrder getFullOrder(@PathVariable String orderId) {
        return orderService.getFullOrder(orderId);
    }

    @PutMapping("/update-status")
    public ResponseEntity<Order> updateOrderStatus(@RequestParam String orderId, @RequestParam String status) {
        Order order = orderService.updateOrderStatus(orderId, status);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/get-customer-from-order/{orderId}")
    public Customer getCustomerFromOrder(@PathVariable String orderId) {
        return orderService.getCustomerFromOrder(orderId);
    }

    public Map<String, Integer> getOrderNumberByDayInMonth(int month, int year) {
        return orderService.getOrderNumberByDayInMonth(month, year);
    }

    @GetMapping("/get-order-quantity-by-province")
    public Map<String, Integer> getOrderQuantityByProvince() {
        return orderService.getOrderQuantityByProvince();
    }

    @GetMapping("/get-product-sold")
    public Map<String, Integer> getProductSold() {
        return orderService.getProductSold();
    }

    @GetMapping("/get-total-order-amount-today")
    public double getTotalOrderAmountToday() {
        return orderService.getTotalOrderAmountToday();
    }

    @GetMapping("/get-paid-orders")
    public List<Order> getPaidOrders() {
        return orderService.getPaidOrders();
    }

    @PutMapping("/update-order-status")
    public ResponseEntity<Order> updateOrderStatus(@RequestBody UpdateOrderStatusRequest request) {
        Order order = orderService.updateOrderStatus(request.getOrderId(), request.getStatus());
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

}
