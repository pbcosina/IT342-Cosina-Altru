package edu.cit.cosina.altru.campaign;

import edu.cit.cosina.altru.user.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;
import java.math.BigDecimal;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Page<Campaign> findByAuthor(User author, Pageable pageable);
    Page<Campaign> findByStatus(CampaignStatus status, Pageable pageable);
    Page<Campaign> findByStatusAndCategoryIgnoreCase(CampaignStatus status, String category, Pageable pageable);
    Page<Campaign> findByStatusAndTitleContainingIgnoreCase(CampaignStatus status, String title, Pageable pageable);
    Page<Campaign> findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCase(CampaignStatus status, String title, String category, Pageable pageable);
    long countByAuthorAndStatus(User author, CampaignStatus status);
    List<Campaign> findTop5ByAuthorOrderByUpdatedAtDesc(User author);

    @Query("select sum(c.currentDonation) from Campaign c where c.author = :author")
    BigDecimal sumCurrentDonationByAuthor(@Param("author") User author);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Campaign c where c.id = :id")
    Optional<Campaign> findByIdForUpdate(@Param("id") Long id);
}