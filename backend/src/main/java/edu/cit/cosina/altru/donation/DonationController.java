package edu.cit.cosina.altru.donation;

import edu.cit.cosina.altru.common.api.ApiResponse;
import edu.cit.cosina.altru.donation.dto.DonationCreateRequest;
import edu.cit.cosina.altru.donation.dto.DonationResponse;
import edu.cit.cosina.altru.donation.service.DonationService;
import edu.cit.cosina.altru.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping("/campaigns/{campaignId}")
    public ResponseEntity<ApiResponse<DonationResponse>> createDonation(
        @PathVariable Long campaignId,
        @Valid @RequestBody DonationCreateRequest request,
        @AuthenticationPrincipal User user
    ) {
        DonationResponse donation = donationService.createDonation(campaignId, request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Donation processed", donation));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getMyDonations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Donations fetched", donationService.getMyDonations(user)));
    }
}
