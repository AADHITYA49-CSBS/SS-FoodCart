package com.ssfoodcart.backend.repository;

import com.ssfoodcart.backend.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByAvailableTrue();
}

