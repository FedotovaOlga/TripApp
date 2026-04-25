package com.trip_app_backend.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.trip_app_backend.dto.CreateTripRequestDto;
import com.trip_app_backend.dto.TripResponseDto;
import com.trip_app_backend.enums.TripStatus;
import com.trip_app_backend.exceptions.BadRequestException;
import com.trip_app_backend.models.Trip;
import com.trip_app_backend.repositories.TripRepository;
import com.trip_app_backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    
    public TripResponseDto createTrip(CreateTripRequestDto request, UUID creatorId) {
        var creator = userRepository.findById(creatorId)
        .orElseThrow(() -> new BadRequestException("User not found"));

        var trip = Trip.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .startAt(request.getStartAt())
            .endAt(request.getEndAt())
            .locationLabel(request.getLocationLabel())
            .creator(creator)
            .address(request.getAddress())
            .city(request.getCity())
            .country(request.getCountry())
            .postalCode(request.getPostalCode())
            .capacity(request.getCapacity())
            .isPaid(request.isPaid())
            .price(request.getPrice())
            .difficulty(request.getDifficulty())
            .createdAt(Instant.now())
            .status(TripStatus.DRAFT)
            .build();

            var saved = tripRepository.save(trip);
            return TripResponseDto.fromEntity(saved);
    }
    public List <TripResponseDto> getAllTrips() {
        return tripRepository.findAll()
        .stream()
        .map(TripResponseDto::fromEntity)
        .toList();
    }
}
