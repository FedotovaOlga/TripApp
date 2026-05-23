package com.trip_app_backend.controllers;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public TripResponseDto createTrip(@RequestPart("trip") @Valid CreateTripRequestDto request, @AuthenticationPrincipal Jwt jwt, @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        return tripService.createTrip(request, UUID.fromString(jwt.getSubject()), file);
    }

    @GetMapping
    public List<TripResponseDto> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/me")
    public Page<TripResponseDto> getMyTrips(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return tripService.getMyTrips(PageRequest.of(page, size), UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/{id}")
    public TripResponseDto getTrip(@PathVariable UUID id) {
        return tripService.getTrip(id);
    }

    @PutMapping("/{id}")
    public TripResponseDto editTrip(@PathVariable UUID id, @RequestPart("trip") @Valid CreateTripRequestDto request, @AuthenticationPrincipal Jwt jwt, @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        return tripService.editTrip(request, id, UUID.fromString(jwt.getSubject()), file);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) throws IOException {
        tripService.deleteTrip(id, UUID.fromString(jwt.getSubject()));
    }

}
