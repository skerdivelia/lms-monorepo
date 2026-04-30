package com.lms.controller;

import com.lms.dto.PaymentIntentDto;
import com.lms.repository.UserRepository;
import com.lms.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/create-intent")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<PaymentIntentDto> createPaymentIntent(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long courseId = request.get("courseId");
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(paymentService.createPaymentIntent(courseId, userId));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> verifyPayment(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");
        boolean verified = paymentService.verifyPayment(paymentIntentId);
        return ResponseEntity.ok(Map.of("verified", verified));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}