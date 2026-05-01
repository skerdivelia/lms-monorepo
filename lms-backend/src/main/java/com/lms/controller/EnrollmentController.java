package com.lms.controller;

import com.lms.dto.CourseResponse;
import com.lms.entity.Enrollment;
import com.lms.entity.User;
import com.lms.repository.UserRepository;
import com.lms.service.CourseService;
import com.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final CourseService courseService;
    private final UserRepository userRepository;

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> enrollInCourse(
            @PathVariable Long courseId,
            @RequestBody Map<String, String> paymentInfo,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        String paymentId = paymentInfo.get("paymentId");
        double amount = Double.parseDouble(paymentInfo.getOrDefault("amount", "0"));
        return ResponseEntity.ok(enrollmentService.enrollInCourse(courseId, userId, paymentId, amount));
    }

    @PutMapping("/{enrollmentId}/progress")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> updateProgress(
            @PathVariable Long enrollmentId,
            @RequestBody Map<String, Integer> progress) {
        enrollmentService.updateProgress(enrollmentId, progress.get("progress"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{enrollmentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Enrollment> getEnrollment(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollment(enrollmentId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getUserEnrollments(userId));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }

    @GetMapping("/check/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(Map.of("enrolled", enrollmentService.isEnrolled(userId, courseId)));
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseResponse>> getMyCourses(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<CourseResponse> courses = enrollmentService.getUserEnrollments(userId).stream()
                .map(enrollment -> courseService.getCourseById(enrollment.getCourse().getId()))
                .toList();
        return ResponseEntity.ok(courses);
    }

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}