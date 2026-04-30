package com.lms.controller;

import com.lms.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate-description")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> generateCourseDescription(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String topic = request.get("topic");
        return ResponseEntity.ok(aiService.generateCourseDescription(title, topic));
    }

    @PostMapping("/generate-lesson")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> generateLessonContent(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String topic = request.get("topic");
        return ResponseEntity.ok(aiService.generateLessonContent(title, topic));
    }

    @PostMapping("/generate-quiz")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> generateQuiz(@RequestBody Map<String, Object> request) {
        String topic = (String) request.get("topic");
        int questionCount = (Integer) request.getOrDefault("questionCount", 5);
        return ResponseEntity.ok(Map.of("quiz", aiService.generateQuiz(topic, questionCount)));
    }
}