package com.example.order.clients;

import com.example.order.dto.ProductPurchaseRequest;
import com.example.order.dto.ProductPurchaseResponse;
import com.example.order.dto.FindAllProductByIdInRequest;
import com.example.order.product.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@FeignClient(name = "product-service", url = "${feign.client.product-service.url}")
public interface ProductFeignClient {
    @GetMapping("/check-product-exists")
    boolean isProductExists(String productId);

    @PostMapping("/purchase")
    List<ProductPurchaseResponse> purchase(List<ProductPurchaseRequest> request);

    @PostMapping("/allByIdIn")
    List<Product> findAllByIdIn(@RequestBody FindAllProductByIdInRequest request);

    @GetMapping("/all")
    List<Product> findAll();
}
