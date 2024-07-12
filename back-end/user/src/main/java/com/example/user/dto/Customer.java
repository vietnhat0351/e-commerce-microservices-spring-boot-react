package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String avatar;
}
