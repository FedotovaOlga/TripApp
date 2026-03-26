package com.trip_app_backend.models;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trip_messages")

@NoArgsConstructor
@Getter
@Setter
public class TripMessage {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Trip trip;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private User author;

    @Column(length = 500, nullable = false)
    private String content;

    @Column(nullable = false)
    private Instant createdAt;
    private Instant deletedAt;

}
