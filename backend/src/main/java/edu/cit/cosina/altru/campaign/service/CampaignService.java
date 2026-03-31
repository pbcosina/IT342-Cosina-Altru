package edu.cit.cosina.altru.campaign.service;

import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.campaign.dto.CampaignUpsertRequest;
import edu.cit.cosina.altru.campaign.Campaign;
import edu.cit.cosina.altru.campaign.CampaignRepository;
import edu.cit.cosina.altru.campaign.CampaignStatus;
import edu.cit.cosina.altru.common.exception.ForbiddenOperationException;
import edu.cit.cosina.altru.common.exception.ResourceNotFoundException;
import edu.cit.cosina.altru.user.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class CampaignService {

    private static final String CAMPAIGN_NOT_FOUND = "Campaign not found";

    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    public List<CampaignResponse> getPublishedCampaigns(String search, String category) {
        String normalizedSearch = search == null ? "" : search.trim();
        String normalizedCategory = category == null ? "" : category.trim();

        List<Campaign> campaigns;
        if (!normalizedSearch.isEmpty() && !normalizedCategory.isEmpty()) {
            campaigns = campaignRepository.findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                CampaignStatus.PUBLISHED,
                normalizedSearch,
                normalizedCategory
            );
        } else if (!normalizedSearch.isEmpty()) {
            campaigns = campaignRepository.findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
                CampaignStatus.PUBLISHED,
                normalizedSearch
            );
        } else if (!normalizedCategory.isEmpty()) {
            campaigns = campaignRepository.findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                CampaignStatus.PUBLISHED,
                normalizedCategory
            );
        } else {
            campaigns = campaignRepository.findByStatusOrderByCreatedAtDesc(CampaignStatus.PUBLISHED);
        }

        return campaigns.stream().map(this::toResponse).toList();
    }

    public List<CampaignResponse> getMyCampaigns(User user) {
        return campaignRepository.findByAuthorOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public CampaignResponse getCampaignById(Long id, User user) {
        Campaign campaign = getCampaignEntityOrThrow(id);
        boolean isOwner = campaign.getAuthor().getId().equals(user.getId());

        if (campaign.getStatus() != CampaignStatus.PUBLISHED && !isOwner) {
            throw new ForbiddenOperationException("Campaign is not accessible");
        }

        return toResponse(campaign);
    }

    public CampaignResponse createCampaign(CampaignUpsertRequest request, User user) {
        Campaign campaign = new Campaign();
        applyCampaignData(campaign, request);
        campaign.setAuthor(user);
        campaign.setCurrentDonation(BigDecimal.ZERO);

        return toResponse(campaignRepository.save(campaign));
    }

    public CampaignResponse updateCampaign(Long id, CampaignUpsertRequest request, User user) {
        Campaign campaign = getCampaignEntityOrThrow(id);
        if (!campaign.getAuthor().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new ForbiddenOperationException("Not allowed to edit this campaign");
        }

        applyCampaignData(campaign, request);
        return toResponse(campaignRepository.save(campaign));
    }

    public void deleteCampaign(Long id, User user) {
        Campaign campaign = getCampaignEntityOrThrow(id);
        if (!campaign.getAuthor().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new ForbiddenOperationException("Not allowed to delete this campaign");
        }

        campaignRepository.delete(campaign);
    }

    public Campaign getCampaignEntityOrThrow(Long id) {
        Objects.requireNonNull(id, "Campaign id is required");
        return campaignRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(CAMPAIGN_NOT_FOUND));
    }

    public Campaign getPublishedCampaignForDonation(Long id) {
        Objects.requireNonNull(id, "Campaign id is required");
        Campaign campaign = campaignRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResourceNotFoundException(CAMPAIGN_NOT_FOUND));

        if (campaign.getStatus() != CampaignStatus.PUBLISHED) {
            throw new ForbiddenOperationException("Cannot donate to draft campaign");
        }

        return campaign;
    }

    public CampaignResponse toResponse(Campaign campaign) {
        CampaignResponse response = new CampaignResponse();
        response.setId(campaign.getId());
        response.setTitle(campaign.getTitle());
        response.setStory(campaign.getStory());
        response.setCategory(campaign.getCategory());
        response.setDonationGoal(campaign.getDonationGoal());
        response.setCurrentDonation(campaign.getCurrentDonation());
        response.setImageUrl(campaign.getImageUrl());
        response.setWhoFor(campaign.getWhoFor());
        response.setStatus(campaign.getStatus().name());
        response.setAuthorId(campaign.getAuthor().getId());
        response.setAuthorName(campaign.getAuthor().getName());
        response.setCreatedAt(campaign.getCreatedAt());
        response.setUpdatedAt(campaign.getUpdatedAt());
        return response;
    }

    private void applyCampaignData(Campaign campaign, CampaignUpsertRequest request) {
        campaign.setTitle(request.getTitle().trim());
        campaign.setStory(request.getStory().trim());
        campaign.setCategory(request.getCategory().trim());
        campaign.setDonationGoal(request.getDonationGoal());
        campaign.setImageUrl(request.getImageUrl() == null ? null : request.getImageUrl().trim());
        campaign.setWhoFor(request.getWhoFor().trim());

        CampaignStatus status = CampaignStatus.DRAFT;
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            status = CampaignStatus.valueOf(request.getStatus().trim().toUpperCase());
        }
        campaign.setStatus(status);
    }
}
