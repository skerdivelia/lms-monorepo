package com.lms.exception;

/**
 * Custom exception for authorization/permission errors.
 * Provides specific handling for unauthorized operations.
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
