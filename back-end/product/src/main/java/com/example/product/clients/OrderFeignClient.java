package com.example.product.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Service
@FeignClient(name = "order-service", url = "${feign.client.order-service.url}")
public interface OrderFeignClient {
    @GetMapping("/get-product-sold")
    Map<String, Integer> getProductSold();
}
