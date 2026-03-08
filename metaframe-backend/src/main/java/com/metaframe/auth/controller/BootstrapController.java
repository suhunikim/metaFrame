// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.controller;

import com.metaframe.auth.dto.BootstrapAdminRequest;
import com.metaframe.auth.dto.BootstrapStateResponse;
import com.metaframe.auth.dto.LoginResponse;
import com.metaframe.auth.service.AuthService;
import com.metaframe.common.response.ApiResponse;
import com.metaframe.common.response.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bootstrap")
public class BootstrapController {

    private final AuthService authService;

    public BootstrapController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/state")
    public ApiResponse<BootstrapStateResponse> getBootstrapState() {
        return ApiResponses.success("BOOTSTRAP_STATE_OK", "Bootstrap state loaded.", authService.getBootstrapState());
    }

    @PostMapping("/admin")
    public ApiResponse<LoginResponse> bootstrapAdmin(
        @Valid @RequestBody BootstrapAdminRequest request,
        HttpServletRequest servletRequest
    ) {
        return ApiResponses.success(
            "BOOTSTRAP_ADMIN_CREATED",
            "Initial administrator created successfully.",
            authService.bootstrapInitialAdmin(request, servletRequest.getHeader("User-Agent"), servletRequest.getRemoteAddr())
        );
    }
}
