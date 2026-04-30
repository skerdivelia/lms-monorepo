package com.lms.service;

import java.util.Map;

public interface AiService {
    Map<String, Object> generateCourseDescription(String title, String topic);
    Map<String, Object> generateLessonContent(String title, String topic);
    String generateQuiz(String topic, int questionCount);
}