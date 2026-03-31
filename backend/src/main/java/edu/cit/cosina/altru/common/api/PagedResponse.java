package edu.cit.cosina.altru.common.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

public class PagedResponse<T> {

    private final List<T> items;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean hasNext;
    private final boolean hasPrevious;
    private final String sortBy;
    private final String sortDirection;

    private PagedResponse(Page<T> sourcePage, String sortBy, String sortDirection) {
        this.items = sourcePage.getContent();
        this.page = sourcePage.getNumber();
        this.size = sourcePage.getSize();
        this.totalElements = sourcePage.getTotalElements();
        this.totalPages = sourcePage.getTotalPages();
        this.hasNext = sourcePage.hasNext();
        this.hasPrevious = sourcePage.hasPrevious();
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }

    public static <T> PagedResponse<T> from(Page<T> sourcePage, Sort sort) {
        Sort.Order order = sort.stream().findFirst().orElse(Sort.Order.by("createdAt"));
        return new PagedResponse<>(sourcePage, order.getProperty(), order.getDirection().name());
    }

    public List<T> getItems() {
        return items;
    }

    public int getPage() {
        return page;
    }

    public int getSize() {
        return size;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public String getSortBy() {
        return sortBy;
    }

    public String getSortDirection() {
        return sortDirection;
    }
}