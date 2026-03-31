package edu.cit.cosina.altru.donation.service;

import edu.cit.cosina.altru.campaign.service.CampaignService;
import edu.cit.cosina.altru.cause.Cause;
import edu.cit.cosina.altru.common.exception.BadRequestException;
import edu.cit.cosina.altru.donation.Donation;
import edu.cit.cosina.altru.donation.DonationRepository;
import edu.cit.cosina.altru.donation.DonationStatus;
import edu.cit.cosina.altru.donation.dto.DonationCreateRequest;
import edu.cit.cosina.altru.donation.dto.DonationResponse;
import edu.cit.cosina.altru.user.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final CampaignService campaignService;

    public DonationService(DonationRepository donationRepository, CampaignService campaignService) {
        this.donationRepository = donationRepository;
        this.campaignService = campaignService;
    }

    @Transactional
    public DonationResponse createDonation(Long campaignId, DonationCreateRequest request, User user) {
        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        Cause campaign = campaignService.getPublishedCampaignForDonation(campaignId);

        Donation donation = new Donation();
        donation.setUser(user);
        donation.setCampaign(campaign);
        donation.setAmount(amount);
        donation.setStatus(DonationStatus.PENDING);
        Donation savedDonation = donationRepository.save(donation);

        campaign.setCurrentDonation(campaign.getCurrentDonation().add(amount));
        savedDonation.setStatus(DonationStatus.COMPLETED);

        return toResponse(donationRepository.save(savedDonation));
    }

    public List<DonationResponse> getMyDonations(User user) {
        return donationRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public DonationResponse toResponse(Donation donation) {
        DonationResponse response = new DonationResponse();
        response.setId(donation.getId());
        response.setUserId(donation.getUser().getId());
        response.setCampaignId(donation.getCampaign().getId());
        response.setAmount(donation.getAmount());
        response.setStatus(donation.getStatus().name());
        response.setCreatedAt(donation.getCreatedAt());
        return response;
    }
}
