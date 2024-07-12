package com.example.payment.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    private String id;
    private String recipientName;
    private String recipientPhone;
    private String street;
    private String province;
    private String district;
    private String ward;
}
