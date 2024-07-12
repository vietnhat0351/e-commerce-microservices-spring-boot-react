package com.example.product.dtos;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FindAllProductByIdInRequest {
    private List<String> ids;
}
