package com.campusexchange.campus_exchange.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ProductResponseDto {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String itemCondition;
    private String status;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerName;
    private String sellerCollege;
    private List<String> images;

    public ProductResponseDto() {}

    public ProductResponseDto(Long id, String title, String description, Double price, String itemCondition, String status, String phoneNumber, LocalDateTime createdAt, LocalDateTime updatedAt, Long categoryId, String categoryName, Long sellerId, String sellerName, String sellerCollege, List<String> images) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.itemCondition = itemCondition;
        this.status = status;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.sellerCollege = sellerCollege;
        this.images = images;
    }

    public static ProductResponseDtoBuilder builder() {
        return new ProductResponseDtoBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getItemCondition() { return itemCondition; }
    public void setItemCondition(String itemCondition) { this.itemCondition = itemCondition; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerCollege() { return sellerCollege; }
    public void setSellerCollege(String sellerCollege) { this.sellerCollege = sellerCollege; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public static class ProductResponseDtoBuilder {
        private Long id;
        private String title;
        private String description;
        private Double price;
        private String itemCondition;
        private String status;
        private String phoneNumber;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long categoryId;
        private String categoryName;
        private Long sellerId;
        private String sellerName;
        private String sellerCollege;
        private List<String> images;

        public ProductResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public ProductResponseDtoBuilder title(String title) { this.title = title; return this; }
        public ProductResponseDtoBuilder description(String description) { this.description = description; return this; }
        public ProductResponseDtoBuilder price(Double price) { this.price = price; return this; }
        public ProductResponseDtoBuilder itemCondition(String itemCondition) { this.itemCondition = itemCondition; return this; }
        public ProductResponseDtoBuilder status(String status) { this.status = status; return this; }
        public ProductResponseDtoBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public ProductResponseDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProductResponseDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ProductResponseDtoBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public ProductResponseDtoBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public ProductResponseDtoBuilder sellerId(Long sellerId) { this.sellerId = sellerId; return this; }
        public ProductResponseDtoBuilder sellerName(String sellerName) { this.sellerName = sellerName; return this; }
        public ProductResponseDtoBuilder sellerCollege(String sellerCollege) { this.sellerCollege = sellerCollege; return this; }
        public ProductResponseDtoBuilder images(List<String> images) { this.images = images; return this; }

        public ProductResponseDto build() {
            return new ProductResponseDto(id, title, description, price, itemCondition, status, phoneNumber, createdAt, updatedAt, categoryId, categoryName, sellerId, sellerName, sellerCollege, images);
        }
    }
}
