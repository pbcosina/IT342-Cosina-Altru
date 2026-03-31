package edu.cit.cosina.altru.donation;

import edu.cit.cosina.altru.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserOrderByCreatedAtDesc(User user);
    Optional<Donation> findByUserAndIdempotencyKey(User user, String idempotencyKey);
}
