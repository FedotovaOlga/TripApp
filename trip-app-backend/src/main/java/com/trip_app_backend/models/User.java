package com.trip_app_backend.models;

import java.time.Instant;
import java.util.List;
import java.util.UUID;


import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.trip_app_backend.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table (name = "users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private Role role;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(length = 500)
    private String bio;
    // @ElementCollection
    // private List <String> interests;
    private String avatarUrl;
    private String displayName;
    private String country;
    private String city;
    private String postalCode;
    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "creator")
    private List<Trip> tripsCreated;

    @OneToMany(mappedBy = "author")
    private List<TripMessage> messagesAuthored;

    @OneToMany(mappedBy = "user")
    private List<Participation> participations;
}