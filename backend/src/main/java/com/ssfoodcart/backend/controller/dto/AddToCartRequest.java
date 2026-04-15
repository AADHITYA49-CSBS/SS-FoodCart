package com.ssfoodcart.backend.controller.dto;

public record AddToCartRequest(Long userId, Long productId, Integer quantity) {
}

