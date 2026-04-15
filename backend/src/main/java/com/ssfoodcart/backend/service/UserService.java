package com.ssfoodcart.backend.service;

import com.ssfoodcart.backend.entity.User;
import com.ssfoodcart.backend.entity.UserRole;
import com.ssfoodcart.backend.repository.UserRepository;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User payload is required");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (user.getRole() == null) {
            user.setRole(UserRole.CUSTOMER);
        }
        userRepository.findByEmail(user.getEmail()).ifPresent(existingUser -> {
            throw new IllegalArgumentException("Email is already registered: " + user.getEmail());
        });
        return userRepository.save(user);
    }

    public User getUserById(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found for ID: " + userId));
    }

    public Optional<User> getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        return userRepository.findByEmail(email);
    }

    public User authenticateUser(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found for email: " + email));

        if (!password.equals(user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }
}

