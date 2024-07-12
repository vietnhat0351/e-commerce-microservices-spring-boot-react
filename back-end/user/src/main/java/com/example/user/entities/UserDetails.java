package com.example.user.entities;

import com.example.user.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class UserDetails {
    @Id
    private String id;
    private String userId;
    private String phone;
    private LocalDate dob;
    private Gender gender;
    private List<Address> addressList;
}
