package com.lms.dto;

import com.lms.entity.Course;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String thumbnail;
    private String shortDescription;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal discountPrice;

    @NotNull(message = "Level is required")
    private Course.CourseLevel level;

    @NotNull(message = "Duration is required")
    private int duration;

    private String requirements;
    private String outcomes;
    private Long categoryId;
}