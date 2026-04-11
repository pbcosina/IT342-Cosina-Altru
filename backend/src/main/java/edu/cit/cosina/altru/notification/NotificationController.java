package edu.cit.cosina.altru.notification;

import edu.cit.cosina.altru.common.api.ApiResponse;
import edu.cit.cosina.altru.notification.dto.NotificationCreateRequest;
import edu.cit.cosina.altru.notification.dto.NotificationResponse;
import edu.cit.cosina.altru.notification.service.NotificationService;
import edu.cit.cosina.altru.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", notificationService.getMyNotifications(user)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
        @AuthenticationPrincipal User user,
        @Valid @RequestBody NotificationCreateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Notification created", notificationService.create(user, request)));
    }
}
