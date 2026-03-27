package com.trip_app_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordAuthRequestDto(@Email @NotBlank String email, @NotBlank String password) {}
