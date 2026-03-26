package com.trip_app_backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trip_app_backend.models.Trip;


public interface TripRepository extends JpaRepository<Trip, UUID> {
    
}
