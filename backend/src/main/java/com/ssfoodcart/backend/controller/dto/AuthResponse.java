package com.ssfoodcart.backend.controller.dto;

public record AuthResponse(String token, UserResponse user) {
}

