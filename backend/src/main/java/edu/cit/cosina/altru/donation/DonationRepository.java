package edu.cit.cosina.altru.donation;

import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserOrderByCreatedAtDesc(User user);
    List<Donation> findTop5ByUserOrderByCreatedAtDesc(User user);
    List<Donation> findTop10ByCampaignIdOrderByCreatedAtDesc(Long campaignId);
    @Query(value = """
        select c.title as campaignTitle, d.amount as amount, d.status as status, d.created_at as createdAt
        from donations d
        join causes c on c.id = d.campaign_id
        where d.user_id = :userId
        order by d.created_at desc
        limit 5
        """, nativeQuery = true)
    List<DonationActivityView> findTop5ActivityByUserId(@Param("userId") Long userId);
    Optional<Donation> findByUserAndIdempotencyKey(User user, String idempotencyKey);
    void deleteByCampaignId(Long campaignId);
    long countByCampaignId(Long campaignId);
    long countByCampaignAuthor(User author);
}
