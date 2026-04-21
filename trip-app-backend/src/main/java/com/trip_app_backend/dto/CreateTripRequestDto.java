package com.trip_app_backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTripRequestDto {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    @Future
    private OffsetDateTime startAt;
    @NotNull
    @Future
    private OffsetDateTime endAt;
    @NotBlank
    private String locationLabel;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    @Min(2)
    private int capacity;
    private boolean isPaid;
    private BigDecimal price;
    private String difficulty;
}
