package com.ssfoodcart.backend.config;

import com.ssfoodcart.backend.entity.Cart;
import com.ssfoodcart.backend.entity.CartItem;
import com.ssfoodcart.backend.entity.DeliveryType;
import com.ssfoodcart.backend.entity.Order;
import com.ssfoodcart.backend.entity.OrderItem;
import com.ssfoodcart.backend.entity.OrderStatus;
import com.ssfoodcart.backend.entity.Product;
import com.ssfoodcart.backend.entity.User;
import com.ssfoodcart.backend.entity.UserRole;
import com.ssfoodcart.backend.repository.CartItemRepository;
import com.ssfoodcart.backend.repository.CartRepository;
import com.ssfoodcart.backend.repository.OrderItemRepository;
import com.ssfoodcart.backend.repository.OrderRepository;
import com.ssfoodcart.backend.repository.ProductRepository;
import com.ssfoodcart.backend.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SampleDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public SampleDataSeeder(
            UserRepository userRepository,
            ProductRepository productRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        User admin = getOrCreateUser("Admin SS FoodCart", "admin@ssfoodcart.com", "admin123", UserRole.ADMIN, "9999999999", "SS FoodCart HQ");
        User customerOne = getOrCreateUser("Aadhitya", "aadhitya@ssfoodcart.com", "cust123", UserRole.CUSTOMER, "9000000001", "Chennai");
        User customerTwo = getOrCreateUser("Priya", "priya@ssfoodcart.com", "cust123", UserRole.CUSTOMER, "9000000002", "Coimbatore");

        Map<String, Product> products = seedProducts();

        seedCart(customerOne, products);

        seedOrders(customerOne, customerTwo, products);

        // Keep admin referenced to avoid accidental cleanup by IDE optimizers in future edits.
        if (admin.getId() == null) {
            throw new IllegalStateException("Sample admin user was not persisted");
        }
    }

    private User getOrCreateUser(
            String name,
            String email,
            String password,
            UserRole role,
            String phone,
            String address) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(password)
                .role(role)
                .phone(phone)
                .address(address)
                .build();
        return userRepository.save(user);
    }

    private Map<String, Product> seedProducts() {
        Map<String, Product> products = new HashMap<>();

        products.put("VEG_STEAM_MOMOS", getOrCreateProduct("Veg Steam Momos", "Momos", "Soft steamed momos stuffed with mixed vegetables", new BigDecimal("129.00"), true));
        products.put("PANEER_TIKKA_MOMOS", getOrCreateProduct("Paneer Tikka Momos", "Momos", "Smoky paneer tikka filling with house masala", new BigDecimal("149.00"), true));
        products.put("CHICKEN_SCHEZWAN_MOMOS", getOrCreateProduct("Chicken Schezwan Momos", "Momos", "Spicy chicken filling tossed in schezwan sauce", new BigDecimal("169.00"), true));

        products.put("BELGIAN_WAFFLE", getOrCreateProduct("Classic Belgian Waffle", "Waffles", "Golden waffle served with maple drizzle", new BigDecimal("179.00"), true));
        products.put("CHOCO_OVERLOAD_WAFFLE", getOrCreateProduct("Chocolate Overload Waffle", "Waffles", "Loaded with dark chocolate sauce and chips", new BigDecimal("229.00"), true));
        products.put("BERRY_CRUNCH_WAFFLE", getOrCreateProduct("Berry Crunch Waffle", "Waffles", "Strawberry compote and crunchy nuts topping", new BigDecimal("219.00"), true));

        products.put("TOMATO_BASIL_SOUP", getOrCreateProduct("Tomato Basil Soup", "Soups", "Creamy tomato soup with basil aroma", new BigDecimal("119.00"), true));
        products.put("SWEET_CORN_SOUP", getOrCreateProduct("Sweet Corn Soup", "Soups", "Sweet corn soup with fresh vegetables", new BigDecimal("109.00"), true));
        products.put("HOT_SOUR_SOUP", getOrCreateProduct("Hot and Sour Soup", "Soups", "Tangy and spicy Asian-style broth", new BigDecimal("129.00"), true));

        return products;
    }

    private Product getOrCreateProduct(String name, String category, String description, BigDecimal price, boolean available) {
        List<Product> byCategory = productRepository.findByCategory(category);
        for (Product product : byCategory) {
            if (name.equalsIgnoreCase(product.getName())) {
                return product;
            }
        }

        Product product = Product.builder()
                .name(name)
                .category(category)
                .description(description)
                .price(price)
                .available(available)
                .build();
        return productRepository.save(product);
    }

    private void seedCart(User user, Map<String, Product> products) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(user.getId()).build()));

        List<CartItem> existingItems = cartItemRepository.findByCartId(cart.getId());
        if (!existingItems.isEmpty()) {
            return;
        }

        CartItem itemOne = CartItem.builder()
                .cartId(cart.getId())
                .productId(products.get("VEG_STEAM_MOMOS").getId())
                .quantity(2)
                .build();
        CartItem itemTwo = CartItem.builder()
                .cartId(cart.getId())
                .productId(products.get("CHOCO_OVERLOAD_WAFFLE").getId())
                .quantity(1)
                .build();

        cartItemRepository.saveAll(List.of(itemOne, itemTwo));
    }

    private void seedOrders(User customerOne, User customerTwo, Map<String, Product> products) {
        if (orderRepository.count() > 0) {
            return;
        }

        createOrderWithItems(
                customerOne.getId(),
                DeliveryType.DIRECT,
                OrderStatus.PENDING,
                LocalDateTime.now().minusHours(2),
                List.of(
                        new SeedOrderItem(products.get("PANEER_TIKKA_MOMOS"), 2),
                        new SeedOrderItem(products.get("TOMATO_BASIL_SOUP"), 1)));

        createOrderWithItems(
                customerTwo.getId(),
                DeliveryType.SWIGGY,
                OrderStatus.CONFIRMED,
                LocalDateTime.now().minusDays(1),
                List.of(
                        new SeedOrderItem(products.get("CHICKEN_SCHEZWAN_MOMOS"), 1),
                        new SeedOrderItem(products.get("BELGIAN_WAFFLE"), 1),
                        new SeedOrderItem(products.get("HOT_SOUR_SOUP"), 2)));
    }

    private void createOrderWithItems(
            Long userId,
            DeliveryType deliveryType,
            OrderStatus status,
            LocalDateTime orderTime,
            List<SeedOrderItem> seedItems) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SeedOrderItem seedItem : seedItems) {
            BigDecimal lineTotal = seedItem.product().getPrice().multiply(BigDecimal.valueOf(seedItem.quantity()));
            totalAmount = totalAmount.add(lineTotal);
        }

        Order order = Order.builder()
                .userId(userId)
                .deliveryType(deliveryType)
                .status(status)
                .totalAmount(totalAmount)
                .orderTime(orderTime)
                .build();
        Order savedOrder = orderRepository.save(order);

        for (SeedOrderItem seedItem : seedItems) {
            OrderItem orderItem = OrderItem.builder()
                    .orderId(savedOrder.getId())
                    .productId(seedItem.product().getId())
                    .quantity(seedItem.quantity())
                    .price(seedItem.product().getPrice())
                    .build();
            orderItemRepository.save(orderItem);
        }
    }

    private record SeedOrderItem(Product product, int quantity) {
    }
}

