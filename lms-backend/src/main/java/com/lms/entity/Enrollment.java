package com.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private double paidAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status;

    private String paymentId;

    private LocalDateTime enrolledAt;

    private LocalDateTime completedAt;

    private int progress; // percentage

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        progress = 0;
    }

    public enum EnrollmentStatus {
        PENDING,
        ACTIVE,
        COMPLETED,
        CANCELLED,
        REFUNDED
    }
}