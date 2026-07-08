package com.campusexchange.campus_exchange.controller;

import com.campusexchange.campus_exchange.dto.NotificationDto;
import com.campusexchange.campus_exchange.dto.ProductResponseDto;
import com.campusexchange.campus_exchange.dto.UserDto;
import com.campusexchange.campus_exchange.service.NotificationService;
import com.campusexchange.campus_exchange.service.ProductService;
import com.campusexchange.campus_exchange.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final ProductService productService;
    private final NotificationService notificationService;

    public UserController(UserService userService, ProductService productService, NotificationService notificationService) {
        this.userService = userService;
        this.productService = productService;
        this.notificationService = notificationService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(Principal principal) {
        UserDto profile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserProfile(@Valid @RequestBody UserDto userDto, Principal principal) {
        UserDto updated = userService.updateUserProfile(principal.getName(), userDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<UserDto> uploadProfilePicture(@RequestParam("file") MultipartFile file, Principal principal) {
        UserDto updated = userService.uploadProfilePicture(principal.getName(), file);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductResponseDto>> getMyProducts(Principal principal) {
        List<ProductResponseDto> products = productService.getMyProducts(principal.getName());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<ProductResponseDto>> getWishlist(Principal principal) {
        List<ProductResponseDto> wishlist = userService.getWishlist(principal.getName());
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<?> toggleWishlist(@PathVariable Long productId, Principal principal) {
        userService.toggleWishlist(principal.getName(), productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Wishlist status updated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Principal principal) {
        List<NotificationDto> notifications = notificationService.getMyNotifications(principal.getName());
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long id, Principal principal) {
        notificationService.markAsRead(id, principal.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification marked as read");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/notifications/read-all")
    public ResponseEntity<?> markAllNotificationsAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
}
