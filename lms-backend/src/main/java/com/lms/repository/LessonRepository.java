package com.lms.repository;

import com.lms.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    Optional<Lesson> findByCourseIdAndId(Long courseId, Long lessonId);
    long countByCourseId(Long courseId);
}