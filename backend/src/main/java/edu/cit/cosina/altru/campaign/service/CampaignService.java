package edu.cit.cosina.altru.campaign.service;

import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.campaign.dto.CampaignUpsertRequest;
import edu.cit.cosina.altru.cause.Cause;
import edu.cit.cosina.altru.cause.CauseRepository;
import edu.cit.cosina.altru.cause.CauseStatus;
import edu.cit.cosina.altru.common.exception.ForbiddenOperationException;
import edu.cit.cosina.altru.common.exception.ResourceNotFoundException;
import edu.cit.cosina.altru.user.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CampaignService {

    private static final String CAMPAIGN_NOT_FOUND = "Campaign not found";

    private final CauseRepository causeRepository;

    public CampaignService(CauseRepository causeRepository) {
        this.causeRepository = causeRepository;
    }

    public List<CampaignResponse> getPublishedCampaigns(String search, String category) {
        String normalizedSearch = search == null ? "" : search.trim();
        String normalizedCategory = category == null ? "" : category.trim();

        List<Cause> campaigns;
        if (!normalizedSearch.isEmpty() && !normalizedCategory.isEmpty()) {
            campaigns = causeRepository.findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                CauseStatus.PUBLISHED,
                normalizedSearch,
                normalizedCategory
            );
        } else if (!normalizedSearch.isEmpty()) {
            campaigns = causeRepository.findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
                CauseStatus.PUBLISHED,
                normalizedSearch
            );
        } else if (!normalizedCategory.isEmpty()) {
            campaigns = causeRepository.findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                CauseStatus.PUBLISHED,
                normalizedCategory
            );
        } else {
            campaigns = causeRepository.findByStatusOrderByCreatedAtDesc(CauseStatus.PUBLISHED);
        }

        return campaigns.stream().map(this::toResponse).toList();
    }

    public List<CampaignResponse> getMyCampaigns(User user) {
        return causeRepository.findByAuthorOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public CampaignResponse getCampaignById(Long id, User user) {
        Cause campaign = getCampaignEntityOrThrow(id);
        boolean isOwner = campaign.getAuthor().getId().equals(user.getId());

        if (campaign.getStatus() != CauseStatus.PUBLISHED && !isOwner) {
            throw new ForbiddenOperationException("Campaign is not accessible");
        }

        return toResponse(campaign);
    }

    public CampaignResponse createCampaign(CampaignUpsertRequest request, User user) {
        Cause campaign = new Cause();
        applyCampaignData(campaign, request);
        campaign.setAuthor(user);
        campaign.setCurrentDonation(BigDecimal.ZERO);

        return toResponse(causeRepository.save(campaign));
    }

    public CampaignResponse updateCampaign(Long id, CampaignUpsertRequest request, User user) {
        Cause campaign = getCampaignEntityOrThrow(id);
        if (!campaign.getAuthor().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new ForbiddenOperationException("Not allowed to edit this campaign");
        }

        applyCampaignData(campaign, request);
        return toResponse(causeRepository.save(campaign));
    }

    public void deleteCampaign(Long id, User user) {
        Cause campaign = getCampaignEntityOrThrow(id);
        if (!campaign.getAuthor().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new ForbiddenOperationException("Not allowed to delete this campaign");
        }

        causeRepository.delete(campaign);
    }

    public Cause getCampaignEntityOrThrow(Long id) {
        return causeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(CAMPAIGN_NOT_FOUND));
    }

    public Cause getPublishedCampaignForDonation(Long id) {
        Cause campaign = causeRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResourceNotFoundException(CAMPAIGN_NOT_FOUND));

        if (campaign.getStatus() != CauseStatus.PUBLISHED) {
            throw new ForbiddenOperationException("Cannot donate to draft campaign");
        }

        return campaign;
    }

    public CampaignResponse toResponse(Cause campaign) {
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

    private void applyCampaignData(Cause campaign, CampaignUpsertRequest request) {
        campaign.setTitle(request.getTitle().trim());
        campaign.setStory(request.getStory().trim());
        campaign.setCategory(request.getCategory().trim());
        campaign.setDonationGoal(request.getDonationGoal());
        campaign.setImageUrl(request.getImageUrl() == null ? null : request.getImageUrl().trim());
        campaign.setWhoFor(request.getWhoFor().trim());

        CauseStatus status = CauseStatus.DRAFT;
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            status = CauseStatus.valueOf(request.getStatus().trim().toUpperCase());
        }
        campaign.setStatus(status);
    }
}
