package com.lms.dto;

public record AuthenticationRequest(
    String email,
    String password
) {}