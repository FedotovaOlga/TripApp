package com.trip_app_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshAuthRequestDto(@NotBlank String refreshToken) {}