package edu.cit.cosina.altru.cause;

import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CauseRepository extends JpaRepository<Cause, Long> {
    List<Cause> findByAuthorOrderByCreatedAtDesc(User author);
    List<Cause> findByStatusOrderByCreatedAtDesc(CauseStatus status);
    List<Cause> findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(CauseStatus status, String category);
    List<Cause> findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(CauseStatus status, String title);
    List<Cause> findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(CauseStatus status, String title, String category);
}
