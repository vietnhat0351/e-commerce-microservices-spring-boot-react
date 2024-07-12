package com.example.order.dto.fullOrder;

import com.example.order.entites.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatar;
    private List<Address> addressList;
}
