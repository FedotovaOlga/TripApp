package com.trip_app_backend.models;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com.trip_app_backend.enums.TripStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "trips")

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Trip {
    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private User creator;

    @Column(nullable = false)
    private String title;
    private String description;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private OffsetDateTime startAt;
    @Column(nullable = false)
    private OffsetDateTime endAt;

    @Column(nullable = false)
    private String locationLabel;
    private String address;
    private String city;
    private String country;
    private String postalCode;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private boolean isPaid;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status;

    private String difficulty;

    @OneToMany(mappedBy = "trip")
    private List<TripMessage> messages;

    @OneToMany(mappedBy = "trip")
    private List<Participation> participations;
}
