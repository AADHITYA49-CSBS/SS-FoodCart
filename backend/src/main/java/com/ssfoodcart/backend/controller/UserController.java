package com.ssfoodcart.backend.controller;

import com.ssfoodcart.backend.controller.dto.LoginRequest;
import com.ssfoodcart.backend.controller.dto.RegisterUserRequest;
import com.ssfoodcart.backend.controller.dto.UserResponse;
import com.ssfoodcart.backend.entity.User;
import com.ssfoodcart.backend.entity.UserRole;
import com.ssfoodcart.backend.service.UserService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody RegisterUserRequest request) {
        UserRole role = request.role() == null || request.role().isBlank()
                ? UserRole.CUSTOMER
                : UserRole.valueOf(request.role().trim().toUpperCase());

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(request.password())
                .role(role)
                .phone(request.phone())
                .address(request.address())
                .build();

        User savedUser = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "User registered successfully",
                        "user", toUserResponse(savedUser)));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        User user = userService.authenticateUser(request.email(), request.password());
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", toUserResponse(user)));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(toUserResponse(userService.getUserById(userId)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new java.util.NoSuchElementException("User not found for email: " + email));
        return ResponseEntity.ok(toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress());
    }
}

