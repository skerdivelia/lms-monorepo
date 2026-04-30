package com.lms.dto;

import com.lms.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnail;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Course.CourseLevel level;
    private int duration;
    private boolean published;
    private boolean approved;
    private String requirements;
    private String outcomes;
    private UserSummary instructor;
    private CategoryResponse category;
    private List<LessonResponse> lessons;
    private double rating;
    private int totalStudents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String firstName;
        private String lastName;
        private String avatar;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonResponse {
        private Long id;
        private String title;
        private String description;
        private String type;
        private String videoUrl;
        private String content;
        private int duration;
        private int orderIndex;
        private boolean free;
        private boolean published;
    }
}