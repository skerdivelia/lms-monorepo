package com.lms.dto;

import com.lms.entity.User;

public record AuthenticationResponse(
    String token,
    Long userId,
    String email,
    String firstName,
    String lastName,
    User.Role role,
    String avatar
) {}