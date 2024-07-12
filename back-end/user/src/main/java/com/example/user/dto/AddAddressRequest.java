package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddAddressRequest {
    private String userId;
    private String recipientName;
    private String recipientPhone;
    private String street;
    private String province;
    private String district;
    private String ward;
}
