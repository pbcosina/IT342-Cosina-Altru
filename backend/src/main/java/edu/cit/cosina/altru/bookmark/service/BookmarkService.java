package edu.cit.cosina.altru.bookmark.service;

import edu.cit.cosina.altru.bookmark.Bookmark;
import edu.cit.cosina.altru.bookmark.BookmarkRepository;
import edu.cit.cosina.altru.campaign.Campaign;
import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.campaign.service.CampaignService;
import edu.cit.cosina.altru.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final CampaignService campaignService;

    public BookmarkService(BookmarkRepository bookmarkRepository, CampaignService campaignService) {
        this.bookmarkRepository = bookmarkRepository;
        this.campaignService = campaignService;
    }

    public List<CampaignResponse> getMyBookmarks(User user) {
        return bookmarkRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .map(Bookmark::getCampaign)
            .map(campaignService::toResponse)
            .toList();
    }

    @Transactional
    public void addBookmark(User user, Long campaignId) {
        Campaign campaign = campaignService.getCampaignEntityOrThrow(campaignId);
        if (bookmarkRepository.existsByUserAndCampaign(user, campaign)) {
            return;
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setCampaign(campaign);
        bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(User user, Long campaignId) {
        Campaign campaign = campaignService.getCampaignEntityOrThrow(campaignId);
        bookmarkRepository.deleteByUserAndCampaign(user, campaign);
    }
}
