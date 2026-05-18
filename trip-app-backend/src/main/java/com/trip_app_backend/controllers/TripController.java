package com.trip_app_backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trip_app_backend.dto.CreateTripRequestDto;
import com.trip_app_backend.dto.TripResponseDto;
import com.trip_app_backend.services.TripService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    
    @PostMapping
    public TripResponseDto createTrip(@RequestBody @Valid CreateTripRequestDto request, @AuthenticationPrincipal Jwt jwt) {
        return tripService.createTrip(request, UUID.fromString(jwt.getSubject()));
    }

    @GetMapping
    public List<TripResponseDto> getAllTrips() {
        return tripService.getAllTrips();
    }


}
