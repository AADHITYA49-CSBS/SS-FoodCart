package com.ssfoodcart.backend.service;

import com.ssfoodcart.backend.entity.Cart;
import com.ssfoodcart.backend.entity.CartItem;
import com.ssfoodcart.backend.entity.DeliveryType;
import com.ssfoodcart.backend.entity.Order;
import com.ssfoodcart.backend.entity.OrderItem;
import com.ssfoodcart.backend.entity.OrderStatus;
import com.ssfoodcart.backend.entity.Product;
import com.ssfoodcart.backend.repository.CartItemRepository;
import com.ssfoodcart.backend.repository.CartRepository;
import com.ssfoodcart.backend.repository.OrderItemRepository;
import com.ssfoodcart.backend.repository.OrderRepository;
import com.ssfoodcart.backend.repository.ProductRepository;
import com.ssfoodcart.backend.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order placeOrder(Long userId, String deliveryType) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (deliveryType == null || deliveryType.isBlank()) {
            throw new IllegalArgumentException("Delivery type is required");
        }

        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found for ID: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Cart not found for user ID: " + userId));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot place order: cart is empty");
        }

        DeliveryType parsedDeliveryType;
        try {
            parsedDeliveryType = DeliveryType.valueOf(deliveryType.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid delivery type: " + deliveryType);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Product not found for ID: " + cartItem.getProductId()));

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .productId(product.getId())
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();
            orderItems.add(orderItem);
        }

        Order order = Order.builder()
                .userId(userId)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .deliveryType(parsedDeliveryType)
                .orderTime(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrderId(savedOrder.getId());
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        return orderRepository.findByUserId(userId);
    }
}

