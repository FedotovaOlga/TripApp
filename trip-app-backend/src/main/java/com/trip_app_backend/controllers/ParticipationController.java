package com.trip_app_backend.controllers;

import java.io.IOException;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trip_app_backend.dto.TripResponseDto;
import com.trip_app_backend.services.ParticipationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/participations")
public class ParticipationController {

    private final ParticipationService participationService;
    
    
    @PostMapping("/join/{tripId}")
    public void joinTrip(@PathVariable UUID tripId, @AuthenticationPrincipal Jwt jwt) {
        participationService.joinTrip(tripId, UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/joined")
    public Page<TripResponseDto> getJoinedTrips(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return participationService.getJoinedTrips(PageRequest.of(page, size), UUID.fromString(jwt.getSubject()));
    }

    @DeleteMapping("/{id}")
    public void deleteParticipation(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) throws IOException {
        participationService.deleteParticipation(id, UUID.fromString(jwt.getSubject()));
    }
}
