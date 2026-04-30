package com.lms.service;

import com.lms.dto.PaymentIntentDto;

public interface PaymentService {
    PaymentIntentDto createPaymentIntent(Long courseId, Long userId);
    boolean verifyPayment(String paymentIntentId);
}