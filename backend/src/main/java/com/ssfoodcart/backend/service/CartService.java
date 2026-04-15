package com.ssfoodcart.backend.service;

import com.ssfoodcart.backend.entity.Cart;
import com.ssfoodcart.backend.entity.CartItem;
import com.ssfoodcart.backend.entity.Product;
import com.ssfoodcart.backend.entity.User;
import com.ssfoodcart.backend.repository.CartItemRepository;
import com.ssfoodcart.backend.repository.CartRepository;
import com.ssfoodcart.backend.repository.ProductRepository;
import com.ssfoodcart.backend.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public CartItem addToCart(Long userId, Long productId, int quantity) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (productId == null) {
            throw new IllegalArgumentException("Product ID is required");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found for ID: " + userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found for ID: " + productId));

        if (!product.isAvailable()) {
            throw new IllegalStateException("Product is currently unavailable: " + product.getName());
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(user.getId()).build()));

        CartItem cartItem = CartItem.builder()
                .cartId(cart.getId())
                .productId(product.getId())
                .quantity(quantity)
                .build();

        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getCartItems(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        return cartRepository.findByUserId(userId)
                .map(cart -> cartItemRepository.findByCartId(cart.getId()))
                .orElse(Collections.emptyList());
    }

    public String removeFromCart(Long cartItemId) {
        if (cartItemId == null) {
            throw new IllegalArgumentException("Cart item ID is required");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found for ID: " + cartItemId));

        cartItemRepository.delete(cartItem);
        return "Cart item removed successfully";
    }

    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) {
        if (cartItemId == null) {
            throw new IllegalArgumentException("Cart item ID is required");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found for ID: " + cartItemId));

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public int clearCart(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        return cartRepository.findByUserId(userId)
                .map(cart -> {
                    List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
                    int removedCount = cartItems.size();
                    if (!cartItems.isEmpty()) {
                        cartItemRepository.deleteAll(cartItems);
                    }
                    return removedCount;
                })
                .orElse(0);
    }
}

