package com.campusexchange.campus_exchange.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String content;

    @NotNull
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, User user, String content, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.isRead = isRead != null ? isRead : false;
        this.createdAt = createdAt;
    }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class NotificationBuilder {
        private Long id;
        private User user;
        private String content;
        private Boolean isRead = false;
        private LocalDateTime createdAt;

        public NotificationBuilder id(Long id) { this.id = id; return this; }
        public NotificationBuilder user(User user) { this.user = user; return this; }
        public NotificationBuilder content(String content) { this.content = content; return this; }
        public NotificationBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public NotificationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Notification build() {
            return new Notification(id, user, content, isRead, createdAt);
        }
    }
}
