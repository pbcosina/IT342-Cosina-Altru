package edu.cit.cosina.altru.campaign.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CampaignResponse {

    private Long id;
    private String title;
    private String story;
    private String category;
    private BigDecimal donationGoal;
    private BigDecimal currentDonation;
    private String imageUrl;
    private String whoFor;
    private String status;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getCurrentDonation() {
        return currentDonation;
    }

    public void setCurrentDonation(BigDecimal currentDonation) {
        this.currentDonation = currentDonation;
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

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
