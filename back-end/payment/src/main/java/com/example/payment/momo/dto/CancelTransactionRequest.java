package com.example.payment.momo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelTransactionRequest {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private String requestType;
    private Long amount;
    private String lang;
    private String description;
    private String signature;
}
