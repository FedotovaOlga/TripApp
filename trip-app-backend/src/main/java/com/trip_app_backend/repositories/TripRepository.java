package com.trip_app_backend.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.trip_app_backend.enums.TripStatus;
import com.trip_app_backend.models.Trip;


public interface TripRepository extends JpaRepository<Trip, UUID> {
    Page<Trip> findAllByCreatorIdAndStatus(UUID creatorId, TripStatus status, PageRequest pageRequest);
    Page<Trip> findAllByStatus(TripStatus status, PageRequest pageRequest);
}

