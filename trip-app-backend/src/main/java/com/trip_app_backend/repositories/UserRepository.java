package com.trip_app_backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trip_app_backend.models.User;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
