package com.ssfoodcart.backend.repository;

import com.ssfoodcart.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}

