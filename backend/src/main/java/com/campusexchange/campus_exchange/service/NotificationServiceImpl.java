package com.campusexchange.campus_exchange.service;

import com.campusexchange.campus_exchange.dto.NotificationDto;
import com.campusexchange.campus_exchange.entity.Notification;
import com.campusexchange.campus_exchange.entity.User;
import com.campusexchange.campus_exchange.exception.ResourceNotFoundException;
import com.campusexchange.campus_exchange.exception.UnauthorizedException;
import com.campusexchange.campus_exchange.repository.NotificationRepository;
import com.campusexchange.campus_exchange.repository.UserRepository;
import com.campusexchange.campus_exchange.utils.DtoConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void createNotification(Long userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .content(content)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(DtoConverter::convertToNotificationDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getEmail().equals(email)) {
            throw new UnauthorizedException("You are not authorized to access this notification.");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<Notification> unread = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(user.getId(), false);
        for (Notification notification : unread) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
