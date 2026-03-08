// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.service;

import com.metaframe.auth.dto.AccountSettingsRequest;
import com.metaframe.auth.dto.BootstrapAdminRequest;
import com.metaframe.auth.dto.BootstrapStateResponse;
import com.metaframe.auth.dto.ChangePasswordRequest;
import com.metaframe.auth.dto.CurrentUserResponse;
import com.metaframe.auth.dto.LoginRequest;
import com.metaframe.auth.dto.LoginResponse;
import com.metaframe.auth.dto.ResetPasswordRequest;
import com.metaframe.auth.dto.SignupRequest;
import com.metaframe.auth.dto.SignupResponse;
import com.metaframe.auth.entity.OrganizationProfileEntity;
import com.metaframe.auth.entity.UserEntity;
import com.metaframe.auth.entity.UserSessionEntity;
import com.metaframe.auth.repository.AuthRepository;
import com.metaframe.common.auth.AuthenticatedUser;
import com.metaframe.common.exception.ApiException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final long sessionHours;

    public AuthService(
        AuthRepository authRepository,
        @Value("${metaframe.auth.session-hours:12}") long sessionHours
    ) {
        this.authRepository = authRepository;
        this.sessionHours = sessionHours;
    }

    public BootstrapStateResponse getBootstrapState() {
        boolean bootstrapRequired = !authRepository.hasInitializedAdmin();
        var organization = authRepository.findOrganizationProfile();
        // - Role: Keep bootstrap defaults stable even before the profile row exists.
        return new BootstrapStateResponse(
            bootstrapRequired,
            organization.map(OrganizationProfileEntity::selfSignupEnabled).orElse(true),
            organization.map(OrganizationProfileEntity::signupMode).orElse("pending_approval")
        );
    }

    @Transactional
    public LoginResponse bootstrapInitialAdmin(BootstrapAdminRequest request, String userAgent, String clientIp) {
        if (authRepository.hasInitializedAdmin()) {
            throw new ApiException(HttpStatus.CONFLICT, "BOOTSTRAP_ALREADY_INITIALIZED", "Initial administrator setup has already been completed.");
        }

        String normalizedEmail = normalizeEmail(request.adminEmail());
        validatePasswordPolicy(request.password());
        OffsetDateTime now = OffsetDateTime.now();
        String userId = "usr_" + UUID.randomUUID().toString().replace("-", "");
        UserEntity user = new UserEntity(
            userId,
            normalizedEmail,
            normalizeName(request.adminName()),
            passwordEncoder.encode(request.password()),
            "owner",
            "active",
            normalizeFreeText(request.organizationName()),
            "system",
            14,
            3,
            now,
            userId,
            null,
            now,
            now
        );
        authRepository.insertUser(user);
        authRepository.insertOrganizationProfile(
            new OrganizationProfileEntity(
                UUID.randomUUID(),
                normalizeFreeText(request.organizationName()),
                true,
                true,
                "pending_approval",
                userId,
                now,
                now
            )
        );

        return createSessionForUser(user, userAgent, clientIp, now);
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (!authRepository.hasInitializedAdmin()) {
            throw new ApiException(HttpStatus.CONFLICT, "BOOTSTRAP_REQUIRED", "Initial administrator setup must be completed before sign-up.");
        }

        BootstrapStateResponse bootstrapState = getBootstrapState();
        if (!bootstrapState.selfSignupEnabled()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "SIGNUP_DISABLED", "Self sign-up is disabled in this environment.");
        }

        String normalizedEmail = normalizeEmail(request.email());
        if (authRepository.findUserByEmail(normalizedEmail).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "DUPLICATE_EMAIL", "An account with this email address already exists.");
        }

        validatePasswordPolicy(request.password());
        OffsetDateTime now = OffsetDateTime.now();
        String status = "pending_approval".equalsIgnoreCase(bootstrapState.signupMode()) ? "pending_approval" : "active";
        String userId = "usr_" + UUID.randomUUID().toString().replace("-", "");
        authRepository.insertUser(
            new UserEntity(
                userId,
                normalizedEmail,
                normalizeName(request.name()),
                passwordEncoder.encode(request.password()),
                "editor",
                status,
                normalizeFreeText(request.extraIdentifier()),
                "system",
                14,
                3,
                "active".equals(status) ? now : null,
                "active".equals(status) ? userId : null,
                null,
                now,
                now
            )
        );

        return new SignupResponse(userId, normalizedEmail, status);
    }

    @Transactional
    public LoginResponse login(LoginRequest request, String userAgent, String clientIp) {
        UserEntity user = authRepository.findUserByEmail(normalizeEmail(request.email()))
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "The provided email or password is incorrect."));

        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "The provided email or password is incorrect.");
        }

        if ("pending_approval".equals(user.accountStatus())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "USER_PENDING_APPROVAL", "Your account is waiting for administrator approval.");
        }

        if ("disabled".equals(user.accountStatus())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "USER_DISABLED", "Your account has been disabled. Please contact an administrator.");
        }

        return createSessionForUser(user, userAgent, clientIp, OffsetDateTime.now());
    }

    public CurrentUserResponse getCurrentUser(String authorizationHeader) {
        return toCurrentUser(requireAuthenticatedUser(authorizationHeader));
    }

    public AuthenticatedUser requireAuthenticatedUser(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        String tokenHash = hashToken(token);
        OffsetDateTime now = OffsetDateTime.now();
        // - Role: Touch the session after lookup so active sessions slide forward with each request.
        AuthenticatedUser user = authRepository.findAuthenticatedSession(tokenHash, now)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "SESSION_EXPIRED", "Your session has expired. Please sign in again."));
        authRepository.touchSession(user.sessionId(), now);
        return user;
    }

    @Transactional
    public void logout(String authorizationHeader) {
        AuthenticatedUser user = requireAuthenticatedUser(authorizationHeader);
        authRepository.revokeSession(user.sessionId(), OffsetDateTime.now());
    }

    @Transactional
    public CurrentUserResponse updateAccountSettings(String authorizationHeader, AccountSettingsRequest request) {
        AuthenticatedUser user = requireAuthenticatedUser(authorizationHeader);
        authRepository.updateAccountSettings(
            user.userId(),
            normalizeName(request.displayName()),
            normalizeTheme(request.themePreference()),
            request.uiFontSize(),
            request.autosaveInterval(),
            OffsetDateTime.now()
        );

        return toCurrentUser(requireUserById(user.userId()));
    }

    @Transactional
    public void changePassword(String authorizationHeader, ChangePasswordRequest request) {
        AuthenticatedUser user = requireAuthenticatedUser(authorizationHeader);
        UserEntity current = requireUserById(user.userId());

        if (!passwordEncoder.matches(request.currentPassword(), current.passwordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CURRENT_PASSWORD_MISMATCH", "The current password does not match.");
        }

        validatePasswordPolicy(request.newPassword());
        if (passwordEncoder.matches(request.newPassword(), current.passwordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_REUSE", "The new password must be different from the current password.");
        }

        authRepository.updatePassword(user.userId(), passwordEncoder.encode(request.newPassword()), OffsetDateTime.now());
    }

    @Transactional
    public void requestPasswordReset(ResetPasswordRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        UserEntity user = authRepository.findUserByEmail(normalizedEmail).orElse(null);
        authRepository.insertPasswordResetRequest(
            UUID.randomUUID(),
            user != null ? user.userId() : null,
            normalizedEmail,
            normalizeFreeText(request.extraIdentifier()),
            "requested",
            OffsetDateTime.now()
        );
    }

    private LoginResponse createSessionForUser(UserEntity user, String userAgent, String clientIp, OffsetDateTime now) {
        String token = UUID.randomUUID() + "." + UUID.randomUUID();
        OffsetDateTime expiresAt = now.plusHours(sessionHours);
        // - Role: Store only the token hash in the database so raw session secrets never persist.
        authRepository.insertSession(
            new UserSessionEntity(
                UUID.randomUUID(),
                user.userId(),
                hashToken(token),
                expiresAt,
                now,
                now,
                null,
                trimToNull(userAgent),
                trimToNull(clientIp)
            )
        );
        authRepository.touchUserLastLogin(user.userId(), now);
        return new LoginResponse(token, expiresAt, toCurrentUser(user));
    }

    private CurrentUserResponse toCurrentUser(UserEntity user) {
        return buildCurrentUserResponse(
            user.userId(),
            user.email(),
            user.displayName(),
            user.globalRole(),
            user.accountStatus(),
            user.themePreference(),
            user.uiFontSize(),
            user.autosaveInterval()
        );
    }

    private CurrentUserResponse toCurrentUser(AuthenticatedUser user) {
        return buildCurrentUserResponse(
            user.userId(),
            user.email(),
            user.displayName(),
            user.globalRole(),
            user.accountStatus(),
            user.themePreference(),
            user.uiFontSize(),
            user.autosaveInterval()
        );
    }

    private CurrentUserResponse buildCurrentUserResponse(
        String userId,
        String email,
        String displayName,
        String globalRole,
        String accountStatus,
        String themePreference,
        int uiFontSize,
        int autosaveInterval
    ) {
        return new CurrentUserResponse(
            userId,
            email,
            displayName,
            globalRole,
            accountStatus,
            themePreference,
            uiFontSize,
            autosaveInterval
        );
    }

    private UserEntity requireUserById(String userId) {
        return authRepository.findUserById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "The current user could not be found."));
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank() || !authorizationHeader.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH_REQUIRED", "Authentication is required.");
        }

        return authorizationHeader.substring("Bearer ".length()).trim();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is required for session hashing.", exception);
        }
    }

    private void validatePasswordPolicy(String password) {
        if (password.isBlank() || password.length() < 8) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_POLICY_FAILED", "Password must be at least 8 characters long.");
        }

        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_POLICY_FAILED", "Password must include both letters and numbers.");
        }
    }

    private String normalizeEmail(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String normalizeName(String value) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_NAME", "A non-empty name is required.");
        }
        return normalized;
    }

    private String normalizeTheme(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase();
        return switch (normalized) {
            case "light", "dark", "system" -> normalized;
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_THEME", "Theme preference must be light, dark, or system.");
        };
    }

    private String normalizeFreeText(String value) {
        return trimToNull(value);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
