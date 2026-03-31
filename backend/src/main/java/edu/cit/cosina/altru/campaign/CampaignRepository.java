package edu.cit.cosina.altru.campaign;

import edu.cit.cosina.altru.user.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByAuthorOrderByCreatedAtDesc(User author);
    List<Campaign> findByStatusOrderByCreatedAtDesc(CampaignStatus status);
    List<Campaign> findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(CampaignStatus status, String category);
    List<Campaign> findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(CampaignStatus status, String title);
    List<Campaign> findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(CampaignStatus status, String title, String category);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Campaign c where c.id = :id")
    Optional<Campaign> findByIdForUpdate(@Param("id") Long id);
}