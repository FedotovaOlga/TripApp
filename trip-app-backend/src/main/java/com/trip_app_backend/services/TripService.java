package com.trip_app_backend.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.trip_app_backend.dto.CreateTripRequestDto;
import com.trip_app_backend.dto.TripResponseDto;
import com.trip_app_backend.enums.TripStatus;
import com.trip_app_backend.exceptions.BadRequestException;
import com.trip_app_backend.exceptions.NotFoundException;
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
        .orElseThrow(() -> new BadRequestException("Utilisateur introuvable"));

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

    public Page<TripResponseDto> getMyTrips(PageRequest pageRequest, UUID userUuid) {
        var page = tripRepository.findAllByCreatorId(userUuid, pageRequest);
        return page.map(TripResponseDto::fromEntity);
        // return tripRepository.findAllByCreatorId(userUuid, pageRequest)
        // .stream()
        // .map(TripResponseDto::fromEntity)
        // .toList();
    }

    public TripResponseDto getTrip(UUID id) {
        return tripRepository.findById(id)
        // .map((trip) -> TripResponseDto.fromEntity(trip))
        .map(TripResponseDto::fromEntity)
        .orElseThrow(() -> new NotFoundException("Voyage introuvable"));
    }

    // @PreAuthorize("@tripService.isTripCreator(#tripId, #userUuid)")
    public TripResponseDto editTrip (CreateTripRequestDto request, UUID tripIUuid, UUID userId) {
        var trip = tripRepository.findById(tripIUuid)
        .orElseThrow(() -> new NotFoundException("Voyage introuvable"));
        if (!trip.getCreator().getId().equals(userId))
            throw new BadRequestException("Vous n'êtes pas le créateur de ce voyage");
        if (!trip.getStatus().equals(TripStatus.DRAFT))
            throw new BadRequestException("Seuls les voyages en brouillon peuvent être modifiés");
        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setStartAt(request.getStartAt());
        trip.setEndAt(request.getEndAt());
        trip.setLocationLabel(request.getLocationLabel());
        trip.setAddress(request.getAddress());
        trip.setCity(request.getCity());
        trip.setCountry(request.getCountry());
        trip.setPostalCode(request.getPostalCode());
        trip.setCapacity(request.getCapacity());
        trip.setPaid(request.isPaid());
        trip.setPrice(request.getPrice());
        trip.setDifficulty(request.getDifficulty());

        var updated = tripRepository.save(trip);
        return TripResponseDto.fromEntity(updated);
    }

        public void deleteTrip (UUID tripIUuid, UUID userId) {
        var trip = tripRepository.findById(tripIUuid)
        .orElseThrow(() -> new NotFoundException("Voyage introuvable"));
        if (!trip.getCreator().getId().equals(userId))
            throw new BadRequestException("Vous n'êtes pas le créateur de ce voyage");
        if (!trip.getStatus().equals(TripStatus.DRAFT))
            throw new BadRequestException("Seuls les voyages en brouillon peuvent être supprimés");
        tripRepository.delete(trip);
    }


}
