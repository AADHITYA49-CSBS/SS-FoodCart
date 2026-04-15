package com.ssfoodcart.backend.controller.dto;

import java.math.BigDecimal;

public record ProductRequest(
        String name,
        String description,
        BigDecimal price,
        String category,
        boolean available) {
}

