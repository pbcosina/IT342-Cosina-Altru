package edu.cit.cosina.altru.campaign;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.cit.cosina.altru.donation.Donation;
import edu.cit.cosina.altru.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "causes")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String story;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal donationGoal = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal currentDonation = BigDecimal.ZERO;

    @Column(length = 1024)
    private String imageUrl;

    @Column(nullable = false)
    private String whoFor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status = CampaignStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnore
    private User author;

    @OneToMany(mappedBy = "campaign")
    @JsonIgnore
    private Set<Donation> donations;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
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

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    @JsonProperty("authorName")
    public String getAuthorName() {
        return author == null ? null : author.getName();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}