package com.trip_app_backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trip_app_backend.models.User;
import java.util.List;


public interface UserRepository extends JpaRepository<User, UUID> {
    
    List<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
