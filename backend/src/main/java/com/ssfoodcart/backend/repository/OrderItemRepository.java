package com.ssfoodcart.backend.repository;

import com.ssfoodcart.backend.entity.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
}

