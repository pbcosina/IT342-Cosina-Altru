package edu.cit.cosina.altru.notification;

import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop20ByUserOrderByCreatedAtDesc(User user);
}
