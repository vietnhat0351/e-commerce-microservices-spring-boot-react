package com.example.order.services;

import com.example.order.OrderRepository;
import com.example.order.clients.ProductFeignClient;
import com.example.order.clients.UserFeignClient;
import com.example.order.dto.UpdateOrderStatusRequest;
import com.example.order.dto.orderRequest.OrderRequest;
import com.example.order.dto.ProductPurchaseRequest;
import com.example.order.dto.fullOrder.FullOrder;
import com.example.order.dto.fullOrder.OrderItem;
import com.example.order.dto.fullOrder.User;
import com.example.order.entites.Address;
import com.example.order.entites.Order;
import com.example.order.enums.OrderStatus;
import com.example.order.exceptions.PlaceOrderException;
import com.example.order.kafka.Customer;
import com.example.order.kafka.OrderConfirmation;
import com.example.order.kafka.OrderProducer;
import com.example.order.product.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserFeignClient userFeignClient;
    private final ProductFeignClient productFeignClient;
    private final OrderMapper orderMapper;
    private final OrderProducer orderProducer;

    // Implement a scheduled task to update the order status every 60 seconds
    // The status of the order should be updated to "CANCELLED" if the order was created more than 30 minutes ago and the status is still "PENDING"
    // The scheduled task should run every 60 seconds
    // The scheduled task should be enabled by default
    // The scheduled task should be able to be disabled by setting the property "order.scheduled-task.enabled" to false

    @Scheduled(fixedRate = 60000)
    public void updateOrderStatusScheduledTask() {
        log.info("Updating order status");
        List<Order> orders = orderRepository.findByStatusAndCreatedAtBefore(
                OrderStatus.PENDING,
                LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).minusMinutes(10));
        orders.forEach((order) -> {
            log.info("Cancelling order {}", order.getId());
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        });
    }

    @Transactional
    public Order createOrder(OrderRequest request) {

        User user = userFeignClient.findUserById(request.getUserId());
        if(user == null) {
            throw new PlaceOrderException("User not found");
        }

        List<ProductPurchaseRequest> productPurchaseRequests = request.getOrderItems().stream()
                .map((item) -> new ProductPurchaseRequest(item.getId(), item.getQuantity()))
                .toList();

        var purchaseResponse = productFeignClient.purchase(productPurchaseRequests);

        if(purchaseResponse.size() != request.getOrderItems().size()) {
            throw new PlaceOrderException("Some products are not available");
        }

        if(user.getAddressList() == null || user.getAddressList().isEmpty()) {
            throw new PlaceOrderException("User has no address");
        }

        Address shippingAddress = user.getAddressList().stream()
                .filter(address -> address.getId().equals(request.getAddressId()))
                .findFirst()
                .orElseThrow(() -> new PlaceOrderException("Address not found"));

        Order order = orderMapper.mapToOrder(request, purchaseResponse, shippingAddress);
        order.setStatus(OrderStatus.PENDING);
        Order savedOrder = orderRepository.save(order);

        List<Product> products = productFeignClient.findAll();

        OrderConfirmation orderConfirmation = OrderConfirmation.builder()
                .createdAt(savedOrder.getCreatedAt())
                .status(savedOrder.getStatus())
                .customer(new Customer(user.getId(), user.getFirstname(), user.getLastname(), user.getEmail()))
                .totalPrice(savedOrder.getTotalPrice())
                .id(savedOrder.getId())
                .shippingAddress(savedOrder.getShippingAddress())
                .paymentMethod(savedOrder.getPaymentMethod())
                .items(savedOrder.getItems().stream().map((item) -> {
                    Product product = products.stream().filter((p) -> p.getId().equals(item.getProductId())).findFirst().orElse(null);
                    assert product != null;
                    return new com.example.order.kafka.OrderItem(product.getId(), product.getName(), product.getImage(), item.getQuantity(), product.getPrice());
                }).toList())
                .build();

        orderProducer.sendOrderConfirmation(orderConfirmation);
        return savedOrder;
    }

    public Order getOrder(String id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByCustomerId(userId);
    }

    public List<FullOrder> getFullOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByCustomerId(userId);
        Map<String, Product> productMap = productFeignClient.findAll().stream().collect(Collectors.toMap(Product::getId, Function.identity()));
        // map to FullOrder
        User customer = userFeignClient.findUserById(userId);
        return orders.stream().map((order) -> {
            List<OrderItem> items = order.getItems().stream().map((item) -> {
                Product product = productMap.get(item.getProductId());
                return new OrderItem(product, item.getQuantity());
            }).toList();
            return FullOrder.builder()
                    .id(order.getId())
                    .customer(customer)
                    .items(items)
                    .paymentMethod(order.getPaymentMethod())
                    .shippingAddress(order.getShippingAddress())
                    .createdAt(order.getCreatedAt())
                    .totalPrice(order.getTotalPrice())
                    .status(order.getStatus())
                    .build();
        }).toList();

    }

    public Order updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if(order == null) {
            throw new RuntimeException("Order not found");
        }
        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    public List<FullOrder> getFullOrders() {
        List<Order> orders = orderRepository.findAll();
        Map<String, Product> productMap = productFeignClient.findAll().stream().collect(Collectors.toMap(Product::getId, product -> product));
        Map<String, User> userMap = userFeignClient.getAllUsers().stream().collect(Collectors.toMap(User::getId, Function.identity()));
        return orders.stream().map((order) -> {
            List<OrderItem> items = order.getItems().stream().map((item) -> {
                Product product = productMap.get(item.getProductId());
                return new OrderItem(product, item.getQuantity());
            }).toList();
            return FullOrder.builder()
                    .id(order.getId())
                    .customer(userMap.get(order.getCustomerId()))
                    .items(items)
                    .paymentMethod(order.getPaymentMethod())
                    .shippingAddress(order.getShippingAddress())
                    .createdAt(order.getCreatedAt())
                    .totalPrice(order.getTotalPrice())
                    .status(order.getStatus())
                    .build();
        }).toList();
    }

    public FullOrder getFullOrder(String orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if(order == null) {
            throw new RuntimeException("Order not found");
        }
        List<Product> products = productFeignClient.findAll();
        User customer = userFeignClient.findUserById(order.getCustomerId());
        List<OrderItem> items = order.getItems().stream().map((item) -> {
            Product product = products.stream().filter((p) -> p.getId().equals(item.getProductId())).findFirst().orElse(null);
            assert product != null;
            return new OrderItem(product, item.getQuantity());
        }).toList();
        return FullOrder.builder()
                .id(order.getId())
                .customer(customer)
                .items(items)
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .build();
    }

    public Customer getCustomerFromOrder(String orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if(order == null) {
            throw new RuntimeException("Order not found");
        }
        User customer = userFeignClient.findUserById(order.getCustomerId());
        return new Customer(customer.getId(), customer.getFirstname(), customer.getLastname(), customer.getEmail());
    }
    // thống kê số lượng sản phẩm đã bán được
    public Map<String, Integer> getProductSold() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().filter(order -> order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CANCELLED)
                .flatMap((order) -> order.getItems().stream())
                .collect(Collectors.groupingBy(com.example.order.entites.OrderItem::getProductId, Collectors.summingInt(com.example.order.entites.OrderItem::getQuantity)));
    }

    public int getTotalOrderQuantity() {
        return orderRepository.findAll().size();
    }

    public Map<String, Integer> getOrderNumberByDayInMonth(int month, int year) {
        return null;
    }

    public Map<String, Integer> getOrderQuantityByProvince() {
        List<Order> completedOrder = orderRepository.findAll().stream().filter(order -> order.getStatus() == OrderStatus.COMPLETED).toList();
        return completedOrder.stream().collect(
                Collectors.groupingBy(order -> order.getShippingAddress().getProvince(), Collectors.summingInt(order -> order.getItems().stream().mapToInt(value -> value.getQuantity()).sum())));
    }

    public double getTotalOrderAmountToday() {
        List<Order> completedOrder = orderRepository.findAll().stream().filter(order -> order.getStatus() == OrderStatus.COMPLETED).toList();
        return completedOrder.stream().filter(order -> order.getCreatedAt().toLocalDate().isEqual(LocalDateTime.now().toLocalDate()))
                .mapToDouble(Order::getTotalPrice).sum();
    }

    public List<Order> getPaidOrders() {
        return orderRepository.findAll().stream().filter(order -> order.getStatus() == OrderStatus.PAID).toList();
    }

}
