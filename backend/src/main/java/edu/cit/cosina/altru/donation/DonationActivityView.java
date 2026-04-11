package edu.cit.cosina.altru.donation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface DonationActivityView {
    String getCampaignTitle();
    BigDecimal getAmount();
    String getStatus();
    LocalDateTime getCreatedAt();
}
