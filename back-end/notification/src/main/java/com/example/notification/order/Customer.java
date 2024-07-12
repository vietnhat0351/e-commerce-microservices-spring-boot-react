package com.example.notification.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
}
