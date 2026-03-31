package edu.cit.cosina.altru.cause;

import edu.cit.cosina.altru.cause.dto.CauseUpsertRequest;
import edu.cit.cosina.altru.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/causes")
public class CauseController {

    private static final String MESSAGE_KEY = "message";
    private static final String CAUSE_NOT_FOUND_MESSAGE = "Cause not found";

    private final CauseRepository causeRepository;

    public CauseController(CauseRepository causeRepository) {
        this.causeRepository = causeRepository;
    }

    @GetMapping
    public List<Cause> getPublishedCauses(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category
    ) {
        String normalizedSearch = search == null ? "" : search.trim();
        String normalizedCategory = category == null ? "" : category.trim();

        if (!normalizedSearch.isEmpty() && !normalizedCategory.isEmpty()) {
            return causeRepository.findByStatusAndTitleContainingIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                CauseStatus.PUBLISHED,
                normalizedSearch,
                normalizedCategory
            );
        }
        if (!normalizedSearch.isEmpty()) {
            return causeRepository.findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
                CauseStatus.PUBLISHED,
                normalizedSearch
            );
        }
        if (!normalizedCategory.isEmpty()) {
            return causeRepository.findByStatusAndCategoryIgnoreCaseOrderByCreatedAtDesc(
                CauseStatus.PUBLISHED,
                normalizedCategory
            );
        }
        return causeRepository.findByStatusOrderByCreatedAtDesc(CauseStatus.PUBLISHED);
    }

    @GetMapping("/my")
    public List<Cause> getMyCauses(@AuthenticationPrincipal User user) {
        return causeRepository.findByAuthorOrderByCreatedAtDesc(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getCauseById(@PathVariable @NonNull Long id, @AuthenticationPrincipal User user) {
        Optional<Cause> causeOptional = causeRepository.findById(id);
        if (causeOptional.isEmpty()) {
            return notFound();
        }

        Cause cause = causeOptional.get();

        boolean isOwner = cause.getAuthor().getId().equals(user.getId());
        if (cause.getStatus() != CauseStatus.PUBLISHED && !isOwner) {
            return forbidden("Cause is not accessible");
        }

        return ResponseEntity.ok(cause);
    }

    @PostMapping
    public ResponseEntity<Cause> createCause(@Valid @RequestBody CauseUpsertRequest request, @AuthenticationPrincipal User user) {
        Cause cause = new Cause();
        applyCauseData(cause, request);
        cause.setAuthor(user);
        cause.setCurrentDonation(BigDecimal.ZERO);

        return ResponseEntity.status(HttpStatus.CREATED).body(causeRepository.save(cause));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCause(
        @PathVariable @NonNull Long id,
        @Valid @RequestBody CauseUpsertRequest request,
        @AuthenticationPrincipal User user
    ) {
        Optional<Cause> causeOptional = causeRepository.findById(id);
        if (causeOptional.isEmpty()) {
            return notFound();
        }
        Cause cause = causeOptional.get();

        if (!cause.getAuthor().getId().equals(user.getId())) {
            return forbidden("Not allowed to edit this cause");
        }

        applyCauseData(cause, request);
        return ResponseEntity.ok(causeRepository.save(cause));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCause(@PathVariable @NonNull Long id, @AuthenticationPrincipal User user) {
        Optional<Cause> causeOptional = causeRepository.findById(id);
        if (causeOptional.isEmpty()) {
            return notFound();
        }
        Cause cause = causeOptional.get();

        if (!cause.getAuthor().getId().equals(user.getId())) {
            return forbidden("Not allowed to delete this cause");
        }

        causeRepository.delete(cause);
        return okMessage("Cause deleted");
    }

    @PostMapping("/{id}/donate")
    public ResponseEntity<Object> donate(@PathVariable @NonNull Long id, @RequestParam BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return badRequest("Amount must be greater than 0");
        }

        Optional<Cause> causeOptional = causeRepository.findById(id);
        if (causeOptional.isEmpty()) {
            return notFound();
        }
        Cause cause = causeOptional.get();

        if (cause.getStatus() != CauseStatus.PUBLISHED) {
            return badRequest("Cannot donate to draft cause");
        }

        cause.setCurrentDonation(cause.getCurrentDonation().add(amount));
        return ResponseEntity.ok(causeRepository.save(cause));
    }

    private ResponseEntity<Object> notFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(MESSAGE_KEY, CAUSE_NOT_FOUND_MESSAGE));
    }

    private ResponseEntity<Object> forbidden(String message) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(MESSAGE_KEY, message));
    }

    private ResponseEntity<Object> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(MESSAGE_KEY, message));
    }

    private ResponseEntity<Object> okMessage(String message) {
        return ResponseEntity.ok(Map.of(MESSAGE_KEY, message));
    }

    private void applyCauseData(Cause cause, CauseUpsertRequest request) {
        cause.setTitle(request.getTitle().trim());
        cause.setStory(request.getStory().trim());
        cause.setCategory(request.getCategory().trim());
        cause.setDonationGoal(request.getDonationGoal());
        cause.setImageUrl(request.getImageUrl());
        cause.setWhoFor(request.getWhoFor().trim());

        CauseStatus status = CauseStatus.DRAFT;
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            status = CauseStatus.valueOf(request.getStatus().trim().toUpperCase());
        }
        cause.setStatus(status);
    }
}
