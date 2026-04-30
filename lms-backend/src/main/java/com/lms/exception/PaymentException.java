package com.lms.exception;

/**
 * Custom exception for payment-related errors.
 * Provides better error handling and differentiation from generic runtime exceptions.
 */
public class PaymentException extends RuntimeException {
    
    public PaymentException(String message) {
        super(message);
    }
    
    public PaymentException(String message, Throwable cause) {
        super(message, cause);
    }
}
