package com.lms.service;

import com.theokanning.openai.service.OpenAiService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    @Value("${openai.api-key}")
    private String openAiApiKey;

    private OpenAiService openAiService;

    @PostConstruct
    public void init() {
        openAiService = new OpenAiService(openAiApiKey, Duration.ofSeconds(30));
    }

    @Override
    public Map<String, Object> generateCourseDescription(String title, String topic) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String prompt = """
                Generate a comprehensive course description for a course titled '%s' about '%s'.
                Include: 1) A compelling description (2-3 paragraphs),
                2) Learning outcomes (5-7 bullet points),
                3) Requirements/Prerequisites (3-5 bullet points).
                Format the response as JSON with keys: description, outcomes, requirements.
                """.formatted(title, topic);

            String response = callOpenAi(prompt);
            result.put("content", response);
            result.put("success", true);
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("success", false);
        }
        
        return result;
    }

    @Override
    public Map<String, Object> generateLessonContent(String title, String topic) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String prompt = """
                Generate detailed lesson content for a lesson titled '%s' about '%s'.
                Include: 1) Introduction, 2) Main content (detailed explanation),
                3) Key points summary, 4) Practice exercise.
                Format as a well-structured article.
                """.formatted(title, topic);

            String response = callOpenAi(prompt);
            result.put("content", response);
            result.put("success", true);
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("success", false);
        }
        
        return result;
    }

    @Override
    public String generateQuiz(String topic, int questionCount) {
        try {
            String prompt = """
                Generate %d multiple choice quiz questions about '%s'.
                Each question should have 4 options with one correct answer.
                Format as JSON array with objects containing: question, options (array), correctAnswer (index).
                """.formatted(questionCount, topic);

            return callOpenAi(prompt);
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }

    private String callOpenAi(String prompt) {
        var completion = openAiService.createCompletion(
            com.theokanning.openai.completion.CompletionRequest.builder()
                .model("gpt-3.5-turbo-instruct")
                .prompt(prompt)
                .maxTokens(1000)
                .temperature(0.7)
                .build()
        );
        
        return completion.getChoices().get(0).getText().trim();
    }
}