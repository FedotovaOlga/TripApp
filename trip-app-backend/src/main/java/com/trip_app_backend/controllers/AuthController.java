package com.trip_app_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trip_app_backend.dto.AuthResponseDto;
import com.trip_app_backend.dto.PasswordAuthRequestDto;
import com.trip_app_backend.dto.RefreshAuthRequestDto;
import com.trip_app_backend.dto.RegisterRequestDto;
import com.trip_app_backend.services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
// @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequestDto request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/password")
    public AuthResponseDto authenticateByPassword(@Valid @RequestBody PasswordAuthRequestDto request) {
        return authService.authenticateByPassword(request.email(), request.password());
    }

    @PostMapping("/refresh")
    public AuthResponseDto authenticateByRefreshToken(@Valid @RequestBody RefreshAuthRequestDto request) {
        return authService.authenticateByRefreshToken(request.refreshToken());
    }
    
}
