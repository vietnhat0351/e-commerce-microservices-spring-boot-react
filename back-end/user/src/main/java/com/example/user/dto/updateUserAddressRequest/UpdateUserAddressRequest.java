package com.example.user.dto.updateUserAddressRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserAddressRequest {
    @NotNull(message = "User id is required")
    @NotEmpty(message = "User id is required")
    private String userId;
    @NotNull(message = "Address is required")
    @Valid
    private Address address;
}
