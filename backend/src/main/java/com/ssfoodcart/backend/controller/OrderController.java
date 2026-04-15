package com.ssfoodcart.backend.controller;

import com.ssfoodcart.backend.controller.dto.PlaceOrderRequest;
import com.ssfoodcart.backend.controller.dto.UpdateOrderStatusRequest;
import com.ssfoodcart.backend.entity.Order;
import com.ssfoodcart.backend.entity.OrderItem;
import com.ssfoodcart.backend.service.OrderService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody PlaceOrderRequest request) {
        Order order = orderService.placeOrder(request.userId(), request.deliveryType());
        return ResponseEntity.ok(Map.of(
                "message", "Order placed successfully",
                "order", order));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderDetails(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        List<OrderItem> items = orderService.getOrderItems(orderId);
        return ResponseEntity.ok(Map.of(
                "order", order,
                "items", items));
    }

    @PutMapping("/status/{orderId}")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, request.status());
        return ResponseEntity.ok(Map.of(
                "message", "Order status updated successfully",
                "order", updatedOrder));
    }
}

