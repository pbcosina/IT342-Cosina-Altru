package edu.cit.cosina.altru.dashboard.service;

import edu.cit.cosina.altru.campaign.Campaign;
import edu.cit.cosina.altru.campaign.CampaignRepository;
import edu.cit.cosina.altru.campaign.CampaignStatus;
import edu.cit.cosina.altru.dashboard.dto.DashboardActivityResponse;
import edu.cit.cosina.altru.dashboard.dto.DashboardSummaryResponse;
import edu.cit.cosina.altru.donation.Donation;
import edu.cit.cosina.altru.donation.DonationActivityView;
import edu.cit.cosina.altru.donation.DonationRepository;
import edu.cit.cosina.altru.user.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DashboardService {

    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;

    public DashboardService(CampaignRepository campaignRepository, DonationRepository donationRepository) {
        this.campaignRepository = campaignRepository;
        this.donationRepository = donationRepository;
    }

    public DashboardSummaryResponse getSummary(User user) {
        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setActiveCampaigns(campaignRepository.countByAuthorAndStatus(user, CampaignStatus.PUBLISHED));
        response.setTotalDonationsReceived(donationRepository.countByCampaignAuthor(user));
        BigDecimal totalRaised = campaignRepository.sumCurrentDonationByAuthor(user);
        response.setTotalAmountRaised(totalRaised == null ? BigDecimal.ZERO : totalRaised);
        response.setRecentActivity(buildRecentActivity(user));
        return response;
    }

    private List<DashboardActivityResponse> buildRecentActivity(User user) {
        List<DashboardActivityResponse> activity = new ArrayList<>();

        for (DonationActivityView donation : donationRepository.findTop5ActivityByUserId(user.getId())) {
            DashboardActivityResponse item = new DashboardActivityResponse();
            item.setType("DONATION");
            item.setTitle("You donated to " + donation.getCampaignTitle());
            item.setSubtitle("Status: " + donation.getStatus());
            item.setAmount(donation.getAmount());
            item.setCreatedAt(donation.getCreatedAt());
            activity.add(item);
        }

        for (Campaign campaign : campaignRepository.findTop5ByAuthorOrderByUpdatedAtDesc(user)) {
            DashboardActivityResponse item = new DashboardActivityResponse();
            item.setType("CAMPAIGN");
            item.setTitle("Campaign updated: " + campaign.getTitle());
            item.setSubtitle("Status: " + campaign.getStatus().name());
            item.setAmount(campaign.getCurrentDonation());
            item.setCreatedAt(campaign.getUpdatedAt());
            activity.add(item);
        }

        return activity.stream()
            .sorted(Comparator.comparing(DashboardActivityResponse::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
            .limit(8)
            .toList();
    }
}
