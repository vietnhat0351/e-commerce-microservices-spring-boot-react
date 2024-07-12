package com.example.user.dto.updateUserAddressRequest;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @NotNull(message = "Address id is required")
    @NotEmpty(message = "Address id is required")
    private String id;
    @NotNull(message = "Recipient name is required")
    @NotEmpty(message = "Recipient name is required")
    private String recipientName;
    @NotNull(message = "Recipient phone is required")
    @NotEmpty(message = "Recipient phone is required")
    private String recipientPhone;
    @NotNull(message = "Street is required")
    @NotEmpty(message = "Street is required")
    private String street;
    @NotNull(message = "Province is required")
    @NotEmpty(message = "Province is required")
    private String province;
    @NotNull(message = "District is required")
    @NotEmpty(message = "District is required")
    private String district;
    @NotNull(message = "Ward is required")
    @NotEmpty(message = "Ward is required")
    private String ward;
}
