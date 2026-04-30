package com.lms.repository;

import com.lms.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByCourseId(Long courseId, Pageable pageable);
    Optional<Review> findByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    long countByCourseId(Long courseId);
}