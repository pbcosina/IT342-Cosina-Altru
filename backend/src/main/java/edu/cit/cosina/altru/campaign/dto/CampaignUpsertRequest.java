package edu.cit.cosina.altru.campaign.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CampaignUpsertRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Story is required")
    private String story;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Donation goal is required")
    @DecimalMin(value = "0.01", message = "Donation goal must be greater than 0")
    private BigDecimal donationGoal;

    private String imageUrl;

    @NotBlank(message = "Who for is required")
    private String whoFor;

    private String status;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getDonationGoal() {
        return donationGoal;
    }

    public void setDonationGoal(BigDecimal donationGoal) {
        this.donationGoal = donationGoal;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getWhoFor() {
        return whoFor;
    }

    public void setWhoFor(String whoFor) {
        this.whoFor = whoFor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
