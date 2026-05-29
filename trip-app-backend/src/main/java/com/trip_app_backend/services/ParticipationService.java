package com.trip_app_backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.trip_app_backend.dto.TripResponseDto;
import com.trip_app_backend.enums.ParticipationStatus;
import com.trip_app_backend.enums.TripStatus;
import com.trip_app_backend.exceptions.BadRequestException;
import com.trip_app_backend.exceptions.NotFoundException;
import com.trip_app_backend.models.Participation;
import com.trip_app_backend.repositories.ParticipationRepository;
import com.trip_app_backend.repositories.TripRepository;
import com.trip_app_backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final TripRepository tripRepository;
    private final ParticipationRepository participationRepository;
    private final UserRepository userRepository;

    public void joinTrip(UUID tripId, UUID userId) {
        var trip = tripRepository.findById(tripId)
        .orElseThrow(() -> new NotFoundException("Voyage introuvable"));
        var user = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        if (trip.getCreator().getId().equals(userId)) {
            throw new BadRequestException("Vous ne pouvez pas rejoindre votre propre voyage");
        }
        if(participationRepository.existsByTripIdAndUserId(tripId, userId)) {
            throw new BadRequestException("Vous avez déjà demandé à rejoindre ce voyage");
        }
            var participation = Participation.builder()
                .trip(trip)
                .user(user)
                .status(ParticipationStatus.REQUESTED)
                .requestedAt(Instant.now())
                .build();
            participationRepository.save(participation);


    }

	public Page<TripResponseDto> getJoinedTrips(PageRequest pageRequest, UUID userId) {
		var page = participationRepository.findAllByUserId(userId, pageRequest);
        return page.map(p -> TripResponseDto.fromEntity(p.getTrip()));
	}

    public void deleteParticipation(UUID participationId, UUID userId) throws IOException {
        var participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new NotFoundException("Participation introuvable"));
                if (!participation.getUser().getId().equals(userId))
                    throw new BadRequestException("Vous n'êtes pas inscrit à ce voyage");
                participationRepository.delete(participation);
    }
    
}
