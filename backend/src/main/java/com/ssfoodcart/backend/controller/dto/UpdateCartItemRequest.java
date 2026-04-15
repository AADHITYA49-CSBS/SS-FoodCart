package com.ssfoodcart.backend.controller.dto;

public record UpdateCartItemRequest(Long cartItemId, Integer quantity) {
}

