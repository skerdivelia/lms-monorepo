package com.lms.repository;

import com.lms.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Page<Course> findByPublishedTrue(Pageable pageable);
    
    Page<Course> findByInstructorIdAndPublished(Long instructorId, boolean published, Pageable pageable);
    
    Page<Course> findByCategoryId(Long categoryId, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND c.title LIKE %:keyword%")
    Page<Course> searchCourses(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true ORDER BY c.totalStudents DESC")
    List<Course> findTopCourses(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND c.approved = true ORDER BY c.createdAt DESC")
    List<Course> findLatestCourses(Pageable pageable);
    
    long countByInstructorId(Long instructorId);
}