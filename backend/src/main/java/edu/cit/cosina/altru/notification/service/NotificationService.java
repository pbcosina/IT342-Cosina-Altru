package edu.cit.cosina.altru.notification.service;

import edu.cit.cosina.altru.notification.Notification;
import edu.cit.cosina.altru.notification.NotificationRepository;
import edu.cit.cosina.altru.notification.dto.NotificationCreateRequest;
import edu.cit.cosina.altru.notification.dto.NotificationResponse;
import edu.cit.cosina.altru.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationResponse> getMyNotifications(User user) {
        return notificationRepository.findTop20ByUserOrderByCreatedAtDesc(user).stream()
            .map(this::toResponse)
            .toList();
    }

    public NotificationResponse create(User user, NotificationCreateRequest request) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.getTitle().trim());
        notification.setMessage(request.getMessage().trim());
        notification.setType(request.getType() == null || request.getType().isBlank() ? "INFO" : request.getType().trim().toUpperCase());
        notification.setRead(false);
        return toResponse(notificationRepository.save(notification));
    }

    public NotificationResponse createSystem(User user, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type == null ? "INFO" : type.toUpperCase());
        notification.setRead(false);
        return toResponse(notificationRepository.save(notification));
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
