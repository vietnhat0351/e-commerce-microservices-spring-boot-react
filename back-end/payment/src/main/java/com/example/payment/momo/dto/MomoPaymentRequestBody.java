package com.example.payment.momo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MomoPaymentRequestBody {
    private String orderId;
    private String orderInfo;
    private String extraData;
}
