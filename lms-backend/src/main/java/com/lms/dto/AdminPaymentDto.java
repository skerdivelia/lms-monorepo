package com.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentDto {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private double paidAmount;
    private String paymentId;
    private String status;
    private LocalDateTime enrolledAt;
}
