package com.example.payment.momo.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentNotification {
    private String partnerCode;
    private String orderId;
    private String requestId;
    private long amount;
    private String storeId;
    private String orderInfo;
    private String partnerUserId;
    private String orderType;
    private long transId;
    private int resultCode;
    private String message;
    private String payType;
    private long responseTime;
    private String extraData;
    private String signature;
    private String paymentOption;
    private long userFee;
}
