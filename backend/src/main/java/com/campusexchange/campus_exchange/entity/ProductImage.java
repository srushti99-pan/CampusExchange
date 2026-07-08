package com.campusexchange.campus_exchange.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    public ProductImage() {}

    public ProductImage(Long id, Product product, String imageUrl, LocalDateTime createdAt) {
        this.id = id;
        this.product = product;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }

    public static ProductImageBuilder builder() {
        return new ProductImageBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ProductImageBuilder {
        private Long id;
        private Product product;
        private String imageUrl;
        private LocalDateTime createdAt;

        public ProductImageBuilder id(Long id) { this.id = id; return this; }
        public ProductImageBuilder product(Product product) { this.product = product; return this; }
        public ProductImageBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ProductImageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ProductImage build() {
            return new ProductImage(id, product, imageUrl, createdAt);
        }
    }
}
