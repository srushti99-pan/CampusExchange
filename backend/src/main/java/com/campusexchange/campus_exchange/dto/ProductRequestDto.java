package com.campusexchange.campus_exchange.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class ProductRequestDto {
    @NotBlank(message = "Product title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Product description is required")
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be greater than or equal to 0")
    private Double price;

    @NotBlank(message = "Item condition is required")
    @Size(max = 20)
    private String itemCondition; // NEW, EXCELLENT, GOOD, FAIR

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Contact phone number is required")
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phoneNumber;

    public ProductRequestDto() {}

    public ProductRequestDto(String title, String description, Double price, String itemCondition, Long categoryId, String phoneNumber) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.itemCondition = itemCondition;
        this.categoryId = categoryId;
        this.phoneNumber = phoneNumber;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getItemCondition() { return itemCondition; }
    public void setItemCondition(String itemCondition) { this.itemCondition = itemCondition; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
