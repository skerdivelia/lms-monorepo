package com.lms.dto;

import com.lms.entity.Lesson;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Type is required")
    private Lesson.LessonType type;

    private String videoUrl;
    private String content;
    private int duration;
    private int orderIndex;
    private boolean free;
}