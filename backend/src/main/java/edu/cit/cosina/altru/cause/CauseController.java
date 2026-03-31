package edu.cit.cosina.altru.cause;

import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.campaign.dto.CampaignUpsertRequest;
import edu.cit.cosina.altru.campaign.service.CampaignService;
import edu.cit.cosina.altru.common.api.ApiResponse;
import edu.cit.cosina.altru.donation.dto.DonationCreateRequest;
import edu.cit.cosina.altru.donation.dto.DonationResponse;
import edu.cit.cosina.altru.donation.service.DonationService;
import edu.cit.cosina.altru.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping({"/api/campaigns", "/api/causes"})
public class CauseController {

    private final CampaignService campaignService;
    private final DonationService donationService;

    public CauseController(CampaignService campaignService, DonationService donationService) {
        this.campaignService = campaignService;
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getPublishedCampaigns(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category
    ) {
        List<CampaignResponse> campaigns = campaignService.getPublishedCampaigns(search, category);
        return ResponseEntity.ok(ApiResponse.success("Campaigns fetched", campaigns));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getMyCampaigns(@AuthenticationPrincipal User user) {
        List<CampaignResponse> campaigns = campaignService.getMyCampaigns(user);
        return ResponseEntity.ok(ApiResponse.success("My campaigns fetched", campaigns));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaignById(
        @PathVariable @NonNull Long id,
        @AuthenticationPrincipal User user
    ) {
        CampaignResponse campaign = campaignService.getCampaignById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Campaign fetched", campaign));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(
        @Valid @RequestBody CampaignUpsertRequest request,
        @AuthenticationPrincipal User user
    ) {
        CampaignResponse campaign = campaignService.createCampaign(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Campaign created", campaign));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateCampaign(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody CampaignUpsertRequest request,
        @AuthenticationPrincipal User user
    ) {
        CampaignResponse campaign = campaignService.updateCampaign(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Campaign updated", campaign));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(@PathVariable @NonNull Long id, @AuthenticationPrincipal User user) {
        campaignService.deleteCampaign(id, user);
        return ResponseEntity.ok(ApiResponse.success("Campaign deleted"));
    }

    // Backward-compatible route during frontend transition.
    @PostMapping("/{id}/donate")
    public ResponseEntity<ApiResponse<DonationResponse>> legacyDonate(
        @PathVariable @NonNull Long id,
        @RequestParam BigDecimal amount,
        @AuthenticationPrincipal User user
    ) {
        DonationCreateRequest request = new DonationCreateRequest();
        request.setAmount(amount);
        DonationResponse donation = donationService.createDonation(id, request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Donation processed", donation));
    }
}
