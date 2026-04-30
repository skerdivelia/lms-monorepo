package com.lms.service;

import com.lms.dto.CourseRequest;
import com.lms.dto.CourseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {
    CourseResponse createCourse(CourseRequest request, Long instructorId);
    CourseResponse updateCourse(Long courseId, CourseRequest request, Long userId);
    void deleteCourse(Long courseId, Long userId);
    CourseResponse getCourseById(Long courseId);
    Page<CourseResponse> getAllCourses(Pageable pageable);
    Page<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable);
    Page<CourseResponse> getCoursesByCategory(Long categoryId, Pageable pageable);
    Page<CourseResponse> searchCourses(String keyword, Pageable pageable);
    List<CourseResponse> getTopCourses(int limit);
    List<CourseResponse> getLatestCourses(int limit);
    CourseResponse publishCourse(Long courseId, Long userId);
    CourseResponse approveCourse(Long courseId, Long adminId);
}