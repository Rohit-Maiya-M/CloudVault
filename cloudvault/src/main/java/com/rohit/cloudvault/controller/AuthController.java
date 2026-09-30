package com.rohit.cloudvault.controller;

import com.rohit.cloudvault.dto.AuthResponse;
import com.rohit.cloudvault.dto.LoginRequest;
import com.rohit.cloudvault.dto.RegisterRequest;
import com.rohit.cloudvault.dto.UserResponse;
import com.rohit.cloudvault.model.User;
import com.rohit.cloudvault.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = userService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        String token = userService.login(request);
        User user = userService.findByEmail(request.getEmail());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();

        return ResponseEntity.ok(response);
    }
}