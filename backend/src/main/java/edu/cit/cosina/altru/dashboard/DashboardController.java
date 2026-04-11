package edu.cit.cosina.altru.dashboard;

import edu.cit.cosina.altru.common.api.ApiResponse;
import edu.cit.cosina.altru.dashboard.dto.DashboardSummaryResponse;
import edu.cit.cosina.altru.dashboard.service.DashboardService;
import edu.cit.cosina.altru.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary fetched", dashboardService.getSummary(user)));
    }
}
