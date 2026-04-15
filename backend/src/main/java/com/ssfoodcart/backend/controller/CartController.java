package com.ssfoodcart.backend.controller;

import com.ssfoodcart.backend.controller.dto.AddToCartRequest;
import com.ssfoodcart.backend.controller.dto.UpdateCartItemRequest;
import com.ssfoodcart.backend.entity.CartItem;
import com.ssfoodcart.backend.service.CartService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody AddToCartRequest request) {
        CartItem cartItem = cartService.addToCart(request.userId(), request.productId(), request.quantity());
        return ResponseEntity.ok(Map.of(
                "message", "Item added to cart successfully",
                "cartItem", cartItem));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateCartItem(@RequestBody UpdateCartItemRequest request) {
        CartItem updatedItem = cartService.updateCartItemQuantity(request.cartItemId(), request.quantity());
        return ResponseEntity.ok(Map.of(
                "message", "Cart item updated successfully",
                "cartItem", updatedItem));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long cartItemId) {
        return ResponseEntity.ok(Map.of("message", cartService.removeFromCart(cartItemId)));
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long userId) {
        int removedCount = cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of(
                "message", "Cart cleared successfully",
                "removedItems", removedCount));
    }
}

