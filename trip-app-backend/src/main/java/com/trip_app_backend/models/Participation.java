package com.trip_app_backend.models;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com.trip_app_backend.enums.ParticipationStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table (name = "participations")
@NoArgsConstructor
@Getter
@Setter
public class Participation {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private Instant requestedAt;

    private Instant joinedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationStatus status;

    @OneToOne(mappedBy = "participation", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToOne(mappedBy = "participation", cascade = CascadeType.ALL)
    private Review review;
}
