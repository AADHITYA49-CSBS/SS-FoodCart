package com.ssfoodcart.backend.controller.dto;

public record RegisterUserRequest(
        String name,
        String email,
        String password,
        String role,
        String phone,
        String address) {
}

