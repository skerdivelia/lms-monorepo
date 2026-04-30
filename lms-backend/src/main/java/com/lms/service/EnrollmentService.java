package com.lms.service;

import com.lms.entity.Enrollment;

public interface EnrollmentService {
    Enrollment enrollInCourse(Long courseId, Long userId, String paymentId, double amount);
    void updateProgress(Long enrollmentId, int progress);
    Enrollment getEnrollment(Long enrollmentId);
    java.util.List<Enrollment> getUserEnrollments(Long userId);
    java.util.List<Enrollment> getCourseEnrollments(Long courseId);
    boolean isEnrolled(Long userId, Long courseId);
}