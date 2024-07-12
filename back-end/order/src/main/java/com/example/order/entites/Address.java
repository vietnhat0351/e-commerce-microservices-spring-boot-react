package com.example.order.entites;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

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
