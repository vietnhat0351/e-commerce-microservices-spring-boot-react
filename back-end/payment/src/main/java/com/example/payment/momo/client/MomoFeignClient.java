package com.example.payment.momo.client;

import com.example.payment.momo.dto.CancelTransactionRequest;
import com.example.payment.momo.dto.PaymentRequest;
import com.example.payment.momo.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@FeignClient(name = "momo-service", url = "https://payment.momo.vn/v2/gateway/api")
public interface MomoFeignClient {
    @PostMapping("/create")
    PaymentResponse createPayment(@RequestBody PaymentRequest request);

    @PostMapping("/confirm")
    Object queryPayment(@RequestBody CancelTransactionRequest request);
}
