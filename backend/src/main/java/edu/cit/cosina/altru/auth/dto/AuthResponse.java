package edu.cit.cosina.altru.auth.dto;

public class AuthResponse {

    private final String token;
    private final String refreshToken;
    private final boolean newUser;

    public AuthResponse(String token, String refreshToken) {
        this(token, refreshToken, false);
    }

    public AuthResponse(String token, String refreshToken, boolean newUser) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.newUser = newUser;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public boolean isNewUser() {
        return newUser;
    }
}
