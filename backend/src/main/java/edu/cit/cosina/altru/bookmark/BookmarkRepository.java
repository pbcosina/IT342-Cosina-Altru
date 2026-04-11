package edu.cit.cosina.altru.bookmark;

import edu.cit.cosina.altru.campaign.Campaign;
import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserAndCampaign(User user, Campaign campaign);
    void deleteByUserAndCampaign(User user, Campaign campaign);
}
