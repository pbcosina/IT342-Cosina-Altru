package edu.cit.cosina.altru.donation;

import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserOrderByCreatedAtDesc(User user);
}
