package edu.cit.cosina.altru.cause;

import edu.cit.cosina.altru.user.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CauseRepository extends JpaRepository<Cause, Long> {
    List<Cause> findByAuthorOrderByCreatedAtDesc(User author);
    List<Cause> findByStatusOrderByCreatedAtDesc(CauseStatus status);
    List<Cause> findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(CauseStatus status, String category);
    List<Cause> findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(CauseStatus status, String title);
    List<Cause> findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(CauseStatus status, String title, String category);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Cause c where c.id = :id")
    Optional<Cause> findByIdForUpdate(@Param("id") Long id);
}
