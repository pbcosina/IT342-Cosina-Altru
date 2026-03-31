package edu.cit.cosina.altru.auth.service;

import edu.cit.cosina.altru.auth.dto.AuthResponse;
import edu.cit.cosina.altru.auth.dto.LoginRequest;
import edu.cit.cosina.altru.auth.dto.RefreshTokenRequest;
import edu.cit.cosina.altru.auth.dto.RegisterRequest;
import edu.cit.cosina.altru.common.exception.ConflictException;
import edu.cit.cosina.altru.common.exception.ForbiddenOperationException;
import edu.cit.cosina.altru.security.JwtService;
import edu.cit.cosina.altru.user.Role;
import edu.cit.cosina.altru.user.User;
import edu.cit.cosina.altru.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already in use");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        String token = jwtService.generateAccessToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);
        return new AuthResponse(token, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new IllegalStateException("User not found"));

        String token = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(token, refreshToken);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken().trim();
        String email = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ForbiddenOperationException("Invalid refresh token"));

        if (!jwtService.isRefreshTokenValid(refreshToken, user)) {
            throw new ForbiddenOperationException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(newAccessToken, newRefreshToken);
    }
}
