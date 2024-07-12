package com.example.payment;

import com.example.payment.momo.MomoService;
import com.example.payment.momo.dto.MomoPaymentRequestBody;
import com.example.payment.momo.dto.PaymentNotification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/payment")
@Slf4j
public class PaymentController {

    private final MomoService momoService;

    @PostMapping("/momo-pay")
    public String payment(@RequestBody MomoPaymentRequestBody request) {
        return momoService.createPayment(request).getPayUrl();
    }

    @PostMapping("/momo-payment-notification")
    public void handlePaymentNotification(@RequestBody PaymentNotification paymentNotification) {
        Payment payment = momoService.handlePaymentNotification(paymentNotification);
        log.info("Payment notification: {}", paymentNotification);
    }

    @GetMapping("/cancel-momo-transaction")
    public RedirectView cancelMomoTransaction(@RequestParam String orderId) {
        momoService.cancelTransaction(orderId);
        return new RedirectView("http://localhost:8080/cancel-transaction");
    }

    @GetMapping("/get-payment-by-order-id/{orderId}")
    public Payment getPaymentByOrderId(@PathVariable String orderId) {
        return momoService.getPaymentByOrderId(orderId);
    }

}
