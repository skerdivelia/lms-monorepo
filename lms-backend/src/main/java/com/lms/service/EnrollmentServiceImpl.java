package com.lms.service;

import com.lms.entity.Course;
import com.lms.entity.Enrollment;
import com.lms.entity.User;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Enrollment enrollInCourse(Long courseId, Long userId, String paymentId, double amount) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .paidAmount(amount)
                .paymentId(paymentId)
                .status(Enrollment.EnrollmentStatus.ACTIVE)
                .progress(0)
                .build();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Update course total students
        course.setTotalStudents(course.getTotalStudents() + 1);
        courseRepository.save(course);

        return savedEnrollment;
    }

    @Override
    @Transactional
    public void updateProgress(Long enrollmentId, int progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setProgress(Math.min(100, Math.max(0, progress)));

        if (progress >= 100) {
            enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
            enrollment.setCompletedAt(java.time.LocalDateTime.now());
        }

        enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollment getEnrollment(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
    }

    @Override
    public List<Enrollment> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    @Override
    public List<Enrollment> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @Override
    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}