package com.ssfoodcart.backend.service;

import com.ssfoodcart.backend.entity.User;
import com.ssfoodcart.backend.repository.UserRepository;
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
        userRepository.findByEmail(user.getEmail()).ifPresent(existingUser -> {
            throw new IllegalArgumentException("Email is already registered: " + user.getEmail());
        });
        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        return userRepository.findByEmail(email);
    }
}

