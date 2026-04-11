package edu.cit.cosina.altru.campaign.service;

import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.campaign.dto.CampaignUpsertRequest;
import edu.cit.cosina.altru.campaign.Campaign;
import edu.cit.cosina.altru.campaign.CampaignRepository;
import edu.cit.cosina.altru.campaign.CampaignStatus;
import edu.cit.cosina.altru.common.api.PagedResponse;
import edu.cit.cosina.altru.common.exception.ForbiddenOperationException;
import edu.cit.cosina.altru.common.exception.ResourceNotFoundException;
import edu.cit.cosina.altru.user.User;
import edu.cit.cosina.altru.donation.DonationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Service
public class CampaignService {

    private static final String CAMPAIGN_NOT_FOUND = "Campaign not found";

    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;

    public CampaignService(CampaignRepository campaignRepository, DonationRepository donationRepository) {
        this.campaignRepository = campaignRepository;
        this.donationRepository = donationRepository;
    }

    public PagedResponse<CampaignResponse> getPublishedCampaigns(
        String search,
        String category,
        int page,
        int size,
        String sortBy,
        String sortDirection
    ) {
        String normalizedSearch = search == null ? "" : search.trim();
        String normalizedCategory = category == null ? "" : category.trim();
        Sort sort = buildSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, Objects.requireNonNull(sort));

        Page<Campaign> campaigns;
        if (!normalizedSearch.isEmpty() && !normalizedCategory.isEmpty()) {
            campaigns = campaignRepository.findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCase(
                CampaignStatus.PUBLISHED,
                normalizedSearch,
                normalizedCategory,
                pageable
            );
        } else if (!normalizedSearch.isEmpty()) {
            campaigns = campaignRepository.findByStatusAndTitleContainingIgnoreCase(
                CampaignStatus.PUBLISHED,
                normalizedSearch,
                pageable
            );
        } else if (!normalizedCategory.isEmpty()) {
            campaigns = campaignRepository.findByStatusAndCategoryIgnoreCase(
                CampaignStatus.PUBLISHED,
                normalizedCategory,
                pageable
            );
        } else {
            campaigns = campaignRepository.findByStatus(CampaignStatus.PUBLISHED, pageable);
        }

        return PagedResponse.from(campaigns.map(this::toResponse), sort);
    }

    public PagedResponse<CampaignResponse> getMyCampaigns(
        User user,
        int page,
        int size,
        String sortBy,
        String sortDirection
    ) {
        Sort sort = buildSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, Objects.requireNonNull(sort));
        Page<CampaignResponse> responsePage = campaignRepository.findByAuthor(user, pageable).map(this::toResponse);
        return PagedResponse.from(responsePage, sort);
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

        donationRepository.deleteByCampaignId(campaign.getId());
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
        LocalDateTime effectiveEndDate = campaign.getEndDate() != null
            ? campaign.getEndDate()
            : campaign.getCreatedAt().plusDays(30);
        response.setEndDate(effectiveEndDate);
        response.setDonationCount(donationRepository.countByCampaignId(campaign.getId()));
        long daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), effectiveEndDate);
        response.setDaysRemaining(Math.max(daysRemaining, 0));
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
        if (campaign.getEndDate() == null) {
            campaign.setEndDate(LocalDateTime.now().plusDays(30));
        }
    }

    private Sort buildSort(String sortBy, String sortDirection) {
        String normalizedSortBy = (sortBy == null || sortBy.isBlank()) ? "createdAt" : sortBy.trim();
        String normalizedDirection = (sortDirection == null || sortDirection.isBlank()) ? "DESC" : sortDirection.trim();
        Sort.Direction direction = "ASC".equalsIgnoreCase(normalizedDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(direction, normalizedSortBy);
    }
}
