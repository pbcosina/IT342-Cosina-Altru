package edu.cit.cosina.altru.user.service;

import edu.cit.cosina.altru.user.User;
import edu.cit.cosina.altru.user.UserRepository;
import edu.cit.cosina.altru.common.exception.BadRequestException;
import edu.cit.cosina.altru.common.exception.ConflictException;
import edu.cit.cosina.altru.user.dto.UserProfileResponse;
import edu.cit.cosina.altru.user.dto.UserUpdateRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse toProfile(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setProfileImageUrl(user.getProfileImageUrl());
        return response;
    }

    public UserProfileResponse updateProfile(User user, UserUpdateRequest request) {
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String normalizedEmail = request.getEmail().trim().toLowerCase();
            if (!normalizedEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
                throw new ConflictException("Email is already in use");
            }
            user.setEmail(normalizedEmail);
        }

        if (request.getProfileImageUrl() != null) {
            String image = request.getProfileImageUrl().trim();
            user.setProfileImageUrl(image.isBlank() ? null : image);
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        }

        User savedUser = userRepository.save(user);
        return toProfile(savedUser);
    }
}
