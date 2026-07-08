package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String content);
    List<NotificationDto> getMyNotifications(String email);
    void markAsRead(Long notificationId, String email);
    void markAllAsRead(String email);
}
