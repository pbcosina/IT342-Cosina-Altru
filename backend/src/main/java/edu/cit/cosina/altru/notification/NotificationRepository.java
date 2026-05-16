package edu.cit.cosina.altru.notification;

import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop20ByUserOrderByCreatedAtDesc(User user);

    @Modifying
    @Query("update Notification n set n.isRead = true where n.user = :user and n.isRead = false")
    int markAllReadByUser(@Param("user") User user);

    @Modifying
    @Query("update Notification n set n.isRead = true where n.user = :user and n.id = :id and n.isRead = false")
    int markReadById(@Param("user") User user, @Param("id") Long id);
}
