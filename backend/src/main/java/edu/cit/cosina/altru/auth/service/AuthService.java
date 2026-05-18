package edu.cit.cosina.altru.auth.service;

import edu.cit.cosina.altru.auth.dto.AuthResponse;
import edu.cit.cosina.altru.auth.dto.GoogleLoginRequest;
import edu.cit.cosina.altru.auth.dto.LoginRequest;
import edu.cit.cosina.altru.auth.dto.RefreshTokenRequest;
import edu.cit.cosina.altru.auth.dto.RegisterRequest;
import edu.cit.cosina.altru.common.exception.BadRequestException;
import edu.cit.cosina.altru.common.exception.ConflictException;
import edu.cit.cosina.altru.common.exception.ForbiddenOperationException;
import edu.cit.cosina.altru.security.JwtService;
import edu.cit.cosina.altru.user.AuthProvider;
import edu.cit.cosina.altru.user.Role;
import edu.cit.cosina.altru.user.User;
import edu.cit.cosina.altru.user.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final FirebaseAuth firebaseAuth;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager,
        FirebaseAuth firebaseAuth
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.firebaseAuth = firebaseAuth;
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
        return new AuthResponse(token, refreshToken, true);
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
        return new AuthResponse(token, refreshToken, false);
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        FirebaseToken firebaseToken = verifyFirebaseToken(request.getIdToken());
        String email = normalizeEmail(firebaseToken.getEmail());
        if (email.isBlank()) {
            throw new BadRequestException("Google account email is missing");
        }

        if (!Boolean.TRUE.equals(firebaseToken.isEmailVerified())) {
            throw new ForbiddenOperationException("Google account email is not verified");
        }

        String firebaseUid = firebaseToken.getUid();
        String displayName = safeText(firebaseToken.getName());
        String photoUrl = safeText(firebaseToken.getPicture());

        User user = userRepository.findByEmail(email).orElse(null);
        boolean isNewUser = false;

        if (user == null) {
            user = new User();
            user.setName(displayName.isBlank() ? defaultNameFromEmail(email) : displayName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole(Role.USER);
            user.setAuthProvider(AuthProvider.GOOGLE);
            user.setProviderId(firebaseUid);
            if (!photoUrl.isBlank()) {
                user.setProfileImageUrl(photoUrl);
            }
            user = userRepository.save(user);
            isNewUser = true;
        } else {
            AuthProvider existingProvider = user.getAuthProvider();
            if (existingProvider == AuthProvider.GOOGLE) {
                String existingProviderId = safeText(user.getProviderId());
                if (!existingProviderId.isBlank() && !existingProviderId.equals(firebaseUid)) {
                    throw new ConflictException("Account is already linked to another provider");
                }
                if (existingProviderId.isBlank()) {
                    user.setProviderId(firebaseUid);
                }
            } else {
                user.setAuthProvider(AuthProvider.GOOGLE);
                user.setProviderId(firebaseUid);
            }

            if (!displayName.isBlank() && (user.getName() == null || user.getName().isBlank())) {
                user.setName(displayName);
            }
            if (!photoUrl.isBlank()) {
                user.setProfileImageUrl(photoUrl);
            }

            user = userRepository.save(user);
        }

        String token = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(token, refreshToken, isNewUser);
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
        return new AuthResponse(newAccessToken, newRefreshToken, false);
    }

    private FirebaseToken verifyFirebaseToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            throw new BadRequestException("ID token is required");
        }

        try {
            return firebaseAuth.verifyIdToken(idToken.trim());
        } catch (FirebaseAuthException ex) {
            throw new ForbiddenOperationException("Invalid Google credentials");
        }
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String defaultNameFromEmail(String email) {
        int atIndex = email.indexOf('@');
        return atIndex > 0 ? email.substring(0, atIndex) : email;
    }
}
