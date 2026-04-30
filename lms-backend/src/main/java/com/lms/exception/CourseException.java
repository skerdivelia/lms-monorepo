package com.lms.exception;

/**
 * Custom exception for course-related errors.
 * Provides better error handling and differentiation from generic runtime exceptions.
 */
public class CourseException extends RuntimeException {
    
    public CourseException(String message) {
        super(message);
    }
    
    public CourseException(String message, Throwable cause) {
        super(message, cause);
    }
}
