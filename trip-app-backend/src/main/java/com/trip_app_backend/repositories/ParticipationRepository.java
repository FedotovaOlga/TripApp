package com.trip_app_backend.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.trip_app_backend.models.Participation;


public interface ParticipationRepository extends JpaRepository<Participation, UUID> {
    boolean existsByTripIdAndUserId(UUID tripId, UUID userId);
    Page<Participation> findAllByUserId(UUID userId, PageRequest pageRequest);
}
