package com.example.user.dto;

import com.example.user.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserProfileRequest {
    private String phone;
    private LocalDate dob;
    private Gender gender;
    private String userId;
}
