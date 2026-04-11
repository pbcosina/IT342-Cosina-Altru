package edu.cit.cosina.altru.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {

    private long totalDonationsReceived;
    private long activeCampaigns;
    private BigDecimal totalAmountRaised;
    private List<DashboardActivityResponse> recentActivity;

    public long getTotalDonationsReceived() {
        return totalDonationsReceived;
    }

    public void setTotalDonationsReceived(long totalDonationsReceived) {
        this.totalDonationsReceived = totalDonationsReceived;
    }

    public long getActiveCampaigns() {
        return activeCampaigns;
    }

    public void setActiveCampaigns(long activeCampaigns) {
        this.activeCampaigns = activeCampaigns;
    }

    public BigDecimal getTotalAmountRaised() {
        return totalAmountRaised;
    }

    public void setTotalAmountRaised(BigDecimal totalAmountRaised) {
        this.totalAmountRaised = totalAmountRaised;
    }

    public List<DashboardActivityResponse> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<DashboardActivityResponse> recentActivity) {
        this.recentActivity = recentActivity;
    }
}
