package com.ssfoodcart.backend.repository;

import com.ssfoodcart.backend.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
}

