package com.lms.service;

import com.lms.dto.PaymentIntentDto;
import com.lms.entity.Course;
import com.lms.exception.PaymentException;
import com.lms.repository.CourseRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final CourseRepository courseRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentIntentDto createPaymentIntent(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new PaymentException("Course not found with id: " + courseId));

        BigDecimal amount = course.getDiscountPrice() != null && course.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0
                ? course.getDiscountPrice()
                : course.getPrice();

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (amount.doubleValue() * 100)) // Convert to cents
                    .setCurrency("usd")
                    .putMetadata("courseId", courseId.toString())
                    .putMetadata("userId", userId.toString())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return PaymentIntentDto.builder()
                    .clientSecret(paymentIntent.getClientSecret())
                    .paymentIntentId(paymentIntent.getId())
                    .amount(amount.doubleValue())
                    .build();
        } catch (StripeException e) {
            throw new PaymentException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyPayment(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            return "succeeded".equals(paymentIntent.getStatus());
        } catch (StripeException e) {
            return false;
        }
    }
}