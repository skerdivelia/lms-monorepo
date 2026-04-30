package com.lms.service;

import com.lms.dto.CourseRequest;
import com.lms.dto.CourseResponse;
import com.lms.entity.Category;
import com.lms.entity.Course;
import com.lms.entity.User;
import com.lms.exception.CourseException;
import com.lms.exception.UnauthorizedException;
import com.lms.repository.CategoryRepository;
import com.lms.repository.CourseRepository;
import com.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new CourseException("Instructor not found with id: " + instructorId));

        if (instructor.getRole() != User.Role.INSTRUCTOR && instructor.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only instructors can create courses");
        }

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .thumbnail(request.getThumbnail())
                .shortDescription(request.getShortDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .level(request.getLevel())
                .duration(request.getDuration())
                .requirements(request.getRequirements())
                .outcomes(request.getOutcomes())
                .instructor(instructor)
                .published(false)
                .approved(false)
                .rating(0)
                .totalStudents(0)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CourseException("Category not found with id: " + request.getCategoryId()));
            course.setCategory(category);
        }

        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(Long courseId, CourseRequest request, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseException("Course not found with id: " + courseId));

        if (!course.getInstructor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own courses");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnail(request.getThumbnail());
        course.setShortDescription(request.getShortDescription());
        course.setPrice(request.getPrice());
        course.setDiscountPrice(request.getDiscountPrice());
        course.setLevel(request.getLevel());
        course.setDuration(request.getDuration());
        course.setRequirements(request.getRequirements());
        course.setOutcomes(request.getOutcomes());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CourseException("Category not found with id: " + request.getCategoryId()));
            course.setCategory(category);
        }

        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    @Override
    @Transactional
    public void deleteCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseException("Course not found with id: " + courseId));

        if (!course.getInstructor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own courses");
        }

        courseRepository.delete(course);
    }

    @Override
    public CourseResponse getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseException("Course not found with id: " + courseId));
        return mapToResponse(course);
    }

    @Override
    public Page<CourseResponse> getAllCourses(Pageable pageable) {
        return courseRepository.findByPublishedTrue(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable) {
        return courseRepository.findByInstructorIdAndPublished(instructorId, true, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<CourseResponse> getCoursesByCategory(Long categoryId, Pageable pageable) {
        return courseRepository.findByCategoryId(categoryId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<CourseResponse> searchCourses(String keyword, Pageable pageable) {
        return courseRepository.searchCourses(keyword, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public List<CourseResponse> getTopCourses(int limit) {
        return courseRepository.findTopCourses(Pageable.ofSize(limit))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> getLatestCourses(int limit) {
        return courseRepository.findLatestCourses(Pageable.ofSize(limit))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseResponse publishCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseException("Course not found with id: " + courseId));

        if (!course.getInstructor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only publish your own courses");
        }

        course.setPublished(true);
        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    @Override
    @Transactional
    public CourseResponse approveCourse(Long courseId, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new CourseException("Admin not found with id: " + adminId));

        if (admin.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only admins can approve courses");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseException("Course not found with id: " + courseId));

        course.setApproved(true);
        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnail(course.getThumbnail())
                .shortDescription(course.getShortDescription())
                .price(course.getPrice())
                .discountPrice(course.getDiscountPrice())
                .level(course.getLevel())
                .duration(course.getDuration())
                .published(course.isPublished())
                .approved(course.isApproved())
                .requirements(course.getRequirements())
                .outcomes(course.getOutcomes())
                .instructor(CourseResponse.UserSummary.builder()
                        .id(course.getInstructor().getId())
                        .firstName(course.getInstructor().getFirstName())
                        .lastName(course.getInstructor().getLastName())
                        .avatar(course.getInstructor().getAvatar())
                        .build())
                .category(course.getCategory() != null ? CourseResponse.CategoryResponse.builder()
                        .id(course.getCategory().getId())
                        .name(course.getCategory().getName())
                        .icon(course.getCategory().getIcon())
                        .build() : null)
                .rating(course.getRating())
                .totalStudents(course.getTotalStudents())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}