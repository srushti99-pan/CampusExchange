package com.campusexchange.campus_exchange.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_reports")
public class ProductReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String reason;

    @Size(max = 500)
    private String details;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, RESOLVED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    public ProductReport() {}

    public ProductReport(Long id, User reporter, Product product, String reason, String details, String status, LocalDateTime createdAt) {
        this.id = id;
        this.reporter = reporter;
        this.product = product;
        this.reason = reason;
        this.details = details;
        this.status = status != null ? status : "PENDING";
        this.createdAt = createdAt;
    }

    public static ProductReportBuilder builder() {
        return new ProductReportBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ProductReportBuilder {
        private Long id;
        private User reporter;
        private Product product;
        private String reason;
        private String details;
        private String status = "PENDING";
        private LocalDateTime createdAt;

        public ProductReportBuilder id(Long id) { this.id = id; return this; }
        public ProductReportBuilder reporter(User reporter) { this.reporter = reporter; return this; }
        public ProductReportBuilder product(Product product) { this.product = product; return this; }
        public ProductReportBuilder reason(String reason) { this.reason = reason; return this; }
        public ProductReportBuilder details(String details) { this.details = details; return this; }
        public ProductReportBuilder status(String status) { this.status = status; return this; }
        public ProductReportBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ProductReport build() {
            return new ProductReport(id, reporter, product, reason, details, status, createdAt);
        }
    }
}
