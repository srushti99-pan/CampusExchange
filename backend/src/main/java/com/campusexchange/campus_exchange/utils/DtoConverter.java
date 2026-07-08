package com.campusexchange.campus_exchange.utils;

import com.campusexchange.campus_exchange.dto.*;
import com.campusexchange.campus_exchange.entity.*;

import java.util.stream.Collectors;

public class DtoConverter {

    public static UserDto convertToUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .college(user.getCollege())
                .branch(user.getBranch())
                .year(user.getYear())
                .phoneNumber(user.getPhoneNumber())
                .profilePictureUrl(user.getProfilePictureUrl())
                .isActive(user.getIsActive())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()))
                .build();
    }

    public static ProductResponseDto convertToProductResponseDto(Product product) {
        if (product == null) return null;
        return ProductResponseDto.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .itemCondition(product.getItemCondition())
                .status(product.getStatus())
                .phoneNumber(product.getPhoneNumber())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .sellerId(product.getSeller().getId())
                .sellerName(product.getSeller().getName())
                .sellerCollege(product.getSeller().getCollege())
                .images(product.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }

    public static CategoryDto convertToCategoryDto(Category category) {
        if (category == null) return null;
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public static ReportResponseDto convertToReportResponseDto(ProductReport report) {
        if (report == null) return null;
        return ReportResponseDto.builder()
                .id(report.getId())
                .productId(report.getProduct().getId())
                .productTitle(report.getProduct().getTitle())
                .reporterId(report.getReporter().getId())
                .reporterEmail(report.getReporter().getEmail())
                .reason(report.getReason())
                .details(report.getDetails())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }

    public static NotificationDto convertToNotificationDto(Notification notification) {
        if (notification == null) return null;
        return NotificationDto.builder()
                .id(notification.getId())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
