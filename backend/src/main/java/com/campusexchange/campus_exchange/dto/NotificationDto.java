package com.campusexchange.campus_exchange.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public NotificationDto(Long id, String content, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public static NotificationDtoBuilder builder() {
        return new NotificationDtoBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class NotificationDtoBuilder {
        private Long id;
        private String content;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public NotificationDtoBuilder id(Long id) { this.id = id; return this; }
        public NotificationDtoBuilder content(String content) { this.content = content; return this; }
        public NotificationDtoBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public NotificationDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationDto build() {
            return new NotificationDto(id, content, isRead, createdAt);
        }
    }
}
