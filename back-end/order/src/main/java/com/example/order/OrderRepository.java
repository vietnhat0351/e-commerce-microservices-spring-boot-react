package com.example.order;

import com.example.order.entites.Order;
import com.example.order.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String>{
    List<Order> findByCustomerId(String userId);

    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime createdAt);
}
