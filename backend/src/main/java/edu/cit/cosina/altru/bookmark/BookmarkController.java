package edu.cit.cosina.altru.bookmark;

import edu.cit.cosina.altru.bookmark.service.BookmarkService;
import edu.cit.cosina.altru.campaign.dto.CampaignResponse;
import edu.cit.cosina.altru.common.api.ApiResponse;
import edu.cit.cosina.altru.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getMyBookmarks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Bookmarks fetched", bookmarkService.getMyBookmarks(user)));
    }

    @PostMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<Void>> addBookmark(@PathVariable Long campaignId, @AuthenticationPrincipal User user) {
        bookmarkService.addBookmark(user, campaignId);
        return ResponseEntity.ok(ApiResponse.success("Campaign bookmarked"));
    }

    @DeleteMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<Void>> removeBookmark(@PathVariable Long campaignId, @AuthenticationPrincipal User user) {
        bookmarkService.removeBookmark(user, campaignId);
        return ResponseEntity.ok(ApiResponse.success("Bookmark removed"));
    }
}
