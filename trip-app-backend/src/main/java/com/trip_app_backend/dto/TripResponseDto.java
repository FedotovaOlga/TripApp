package com.trip_app_backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.trip_app_backend.enums.TripStatus;
import com.trip_app_backend.models.Trip;

public record TripResponseDto(
    UUID id,
    UUID creatorId,
    String creatorName,
    String title,
    String description,
    Instant createdAt,
    OffsetDateTime startAt,
    OffsetDateTime endAt,
    String locationLabel,
    String address,
    String city,
    String country,
    String postalCode,
    int capacity,
    boolean isPaid,
    BigDecimal price,
    TripStatus status,
    String difficulty,
    String imageUrl,
    long participantCount) {

    public static TripResponseDto fromEntity(Trip trip, long participantCount) {
        return new TripResponseDto(
            trip.getId(),
            trip.getCreator().getId(),
            trip.getCreator().getDisplayName(),
            trip.getTitle(),
            trip.getDescription(),
            trip.getCreatedAt(),
            trip.getStartAt(),
            trip.getEndAt(),
            trip.getLocationLabel(),
            trip.getAddress(),
            trip.getCity(),
            trip.getCountry(),
            trip.getPostalCode(),
            trip.getCapacity(),
            trip.isPaid(),
            trip.getPrice(),
            trip.getStatus(),
            trip.getDifficulty(),
            trip.getImageUrl(),
            participantCount
        );
    };
}
