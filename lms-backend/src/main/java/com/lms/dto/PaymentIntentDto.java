package com.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentDto {
    private String clientSecret;
    private String paymentIntentId;
    private double amount;
}