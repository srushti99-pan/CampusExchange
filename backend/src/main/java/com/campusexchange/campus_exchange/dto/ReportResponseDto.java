package com.campusexchange.campus_exchange.dto;

import java.time.LocalDateTime;

public class ReportResponseDto {
    private Long id;
    private Long productId;
    private String productTitle;
    private Long reporterId;
    private String reporterEmail;
    private String reason;
    private String details;
    private String status;
    private LocalDateTime createdAt;

    public ReportResponseDto() {}

    public ReportResponseDto(Long id, Long productId, String productTitle, Long reporterId, String reporterEmail, String reason, String details, String status, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.reporterId = reporterId;
        this.reporterEmail = reporterEmail;
        this.reason = reason;
        this.details = details;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static ReportResponseDtoBuilder builder() {
        return new ReportResponseDtoBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ReportResponseDtoBuilder {
        private Long id;
        private Long productId;
        private String productTitle;
        private Long reporterId;
        private String reporterEmail;
        private String reason;
        private String details;
        private String status;
        private LocalDateTime createdAt;

        public ReportResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public ReportResponseDtoBuilder productId(Long productId) { this.productId = productId; return this; }
        public ReportResponseDtoBuilder productTitle(String productTitle) { this.productTitle = productTitle; return this; }
        public ReportResponseDtoBuilder reporterId(Long reporterId) { this.reporterId = reporterId; return this; }
        public ReportResponseDtoBuilder reporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; return this; }
        public ReportResponseDtoBuilder reason(String reason) { this.reason = reason; return this; }
        public ReportResponseDtoBuilder details(String details) { this.details = details; return this; }
        public ReportResponseDtoBuilder status(String status) { this.status = status; return this; }
        public ReportResponseDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReportResponseDto build() {
            return new ReportResponseDto(id, productId, productTitle, reporterId, reporterEmail, reason, details, status, createdAt);
        }
    }
}
