package com.example.user.dto;

import com.example.user.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetUserProfileResponse {
    private String id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatar;
    private String phone;
    private LocalDate dob;
    private Gender gender;
}
