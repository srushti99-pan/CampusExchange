package com.campusexchange.campus_exchange.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 5000)
    private String description;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double price;

    @NotBlank
    @Size(max = 20)
    @Column(name = "item_condition", nullable = false)
    private String itemCondition; // NEW, EXCELLENT, GOOD, FAIR

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, SOLD

    @NotBlank
    @Size(max = 15)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Product() {}

    public Product(Long id, User seller, String title, String description, Double price, String itemCondition, Category category, String status, String phoneNumber, List<ProductImage> images, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.seller = seller;
        this.title = title;
        this.description = description;
        this.price = price;
        this.itemCondition = itemCondition;
        this.category = category;
        this.status = status != null ? status : "AVAILABLE";
        this.phoneNumber = phoneNumber;
        this.images = images != null ? images : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ProductBuilder builder() {
        return new ProductBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getItemCondition() { return itemCondition; }
    public void setItemCondition(String itemCondition) { this.itemCondition = itemCondition; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class ProductBuilder {
        private Long id;
        private User seller;
        private String title;
        private String description;
        private Double price;
        private String itemCondition;
        private Category category;
        private String status = "AVAILABLE";
        private String phoneNumber;
        private List<ProductImage> images;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ProductBuilder id(Long id) { this.id = id; return this; }
        public ProductBuilder seller(User seller) { this.seller = seller; return this; }
        public ProductBuilder title(String title) { this.title = title; return this; }
        public ProductBuilder description(String description) { this.description = description; return this; }
        public ProductBuilder price(Double price) { this.price = price; return this; }
        public ProductBuilder itemCondition(String itemCondition) { this.itemCondition = itemCondition; return this; }
        public ProductBuilder category(Category category) { this.category = category; return this; }
        public ProductBuilder status(String status) { this.status = status; return this; }
        public ProductBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public ProductBuilder images(List<ProductImage> images) { this.images = images; return this; }
        public ProductBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProductBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Product build() {
            return new Product(id, seller, title, description, price, itemCondition, category, status, phoneNumber, images, createdAt, updatedAt);
        }
    }
}
