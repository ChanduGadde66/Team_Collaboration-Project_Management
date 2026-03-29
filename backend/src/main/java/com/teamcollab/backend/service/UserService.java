package com.teamcollab.backend.service;

import com.teamcollab.backend.entity.User;

import java.util.Optional;

public interface UserService {

    User registerUser(User user);
    String loginUser(String email, String password);

    Optional<User> getUserByEmail(String email);
}