package com.lms.controller;

import com.lms.dto.AdminUserDto;
import com.lms.dto.AdminPaymentDto;
import com.lms.entity.User;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        List<AdminUserDto> users = userRepository.findAll().stream()
                .map(user -> AdminUserDto.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .enabled(user.isEnabled())
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{userId}/block")
    public ResponseEntity<AdminUserDto> blockUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(toAdminDto(updated));
    }

    @PatchMapping("/users/{userId}/unblock")
    public ResponseEntity<AdminUserDto> unblockUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(toAdminDto(updated));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        // Delete all enrollments first
        enrollmentRepository.findByUserId(userId).forEach(enrollmentRepository::delete);
        // Then delete the user
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/payments")
    public ResponseEntity<List<AdminPaymentDto>> getAllPayments() {
        List<AdminPaymentDto> payments = enrollmentRepository.findAll().stream()
                .map(enrollment -> AdminPaymentDto.builder()
                        .id(enrollment.getId())
                        .userId(enrollment.getUser().getId())
                        .userEmail(enrollment.getUser().getEmail())
                        .userName(enrollment.getUser().getFirstName() + " " + enrollment.getUser().getLastName())
                        .courseId(enrollment.getCourse().getId())
                        .courseTitle(enrollment.getCourse().getTitle())
                        .paidAmount(enrollment.getPaidAmount())
                        .paymentId(enrollment.getPaymentId())
                        .status(enrollment.getStatus().name())
                        .enrolledAt(enrollment.getEnrolledAt())
                        .build())
                .toList();
        return ResponseEntity.ok(payments);
    }

    private AdminUserDto toAdminDto(User user) {
        return AdminUserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
