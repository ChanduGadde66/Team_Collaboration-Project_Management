package com.teamcollab.backend.controller;

import com.teamcollab.backend.dto.AuthResponse;
import com.teamcollab.backend.dto.LoginRequest;
import com.teamcollab.backend.entity.User;
import com.teamcollab.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {
        String token = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );
        return ResponseEntity.ok(new AuthResponse(token));
    }
}