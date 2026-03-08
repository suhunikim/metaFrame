// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.controller;

import com.metaframe.auth.dto.AccountSettingsRequest;
import com.metaframe.auth.dto.ChangePasswordRequest;
import com.metaframe.auth.dto.CurrentUserResponse;
import com.metaframe.auth.dto.LoginRequest;
import com.metaframe.auth.dto.LoginResponse;
import com.metaframe.auth.dto.ResetPasswordRequest;
import com.metaframe.auth.dto.SignupRequest;
import com.metaframe.auth.dto.SignupResponse;
import com.metaframe.auth.service.AuthService;
import com.metaframe.common.response.ApiResponse;
import com.metaframe.common.response.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/api/auth/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        return ApiResponses.success(
            "AUTH_LOGIN_OK",
            "Login completed successfully.",
            authService.login(request, servletRequest.getHeader("User-Agent"), servletRequest.getRemoteAddr())
        );
    }

    @PostMapping("/api/auth/logout")
    public ApiResponse<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        authService.logout(authorizationHeader);
        return ApiResponses.success("AUTH_LOGOUT_OK", "Logout completed successfully.");
    }

    @GetMapping("/api/auth/me")
    public ApiResponse<CurrentUserResponse> getCurrentUser(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return ApiResponses.success("AUTH_ME_OK", "Current user loaded.", authService.getCurrentUser(authorizationHeader));
    }

    @PatchMapping("/api/auth/me")
    public ApiResponse<CurrentUserResponse> updateAccountSettings(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @Valid @RequestBody AccountSettingsRequest request
    ) {
        return ApiResponses.success(
            "AUTH_ACCOUNT_UPDATED",
            "Account settings updated successfully.",
            authService.updateAccountSettings(authorizationHeader, request)
        );
    }

    @PostMapping("/api/auth/password/change")
    public ApiResponse<Void> changePassword(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(authorizationHeader, request);
        return ApiResponses.success("AUTH_PASSWORD_CHANGED", "Password updated successfully.");
    }

    @PostMapping("/api/auth/password/reset-request")
    public ApiResponse<Void> requestReset(@Valid @RequestBody ResetPasswordRequest request) {
        authService.requestPasswordReset(request);
        return ApiResponses.success("AUTH_PASSWORD_RESET_REQUESTED", "Password reset request recorded successfully.");
    }

    @PostMapping("/api/users/signup")
    public ApiResponse<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ApiResponses.success("AUTH_SIGNUP_OK", "Sign-up completed successfully.", authService.signup(request));
    }
}
