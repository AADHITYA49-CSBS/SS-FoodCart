package com.ssfoodcart.backend.controller.dto;

import com.ssfoodcart.backend.entity.UserRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role,
        String phone,
        String address) {
}

