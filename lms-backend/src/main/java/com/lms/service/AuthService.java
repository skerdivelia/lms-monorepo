package com.lms.service;

import com.lms.dto.AuthenticationRequest;
import com.lms.dto.AuthenticationResponse;
import com.lms.dto.RegisterRequest;

public interface AuthService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
}