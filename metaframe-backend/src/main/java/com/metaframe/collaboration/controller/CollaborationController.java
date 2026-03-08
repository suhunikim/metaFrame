// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.collaboration.controller;

import com.metaframe.auth.service.AuthService;
import com.metaframe.collaboration.dto.PresenceHeartbeatRequest;
import com.metaframe.collaboration.dto.PresenceResponse;
import com.metaframe.collaboration.service.CollaborationService;
import com.metaframe.common.response.ApiResponse;
import com.metaframe.common.response.ApiResponses;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects/{projectId}/presence")
public class CollaborationController {

    private final CollaborationService collaborationService;
    private final AuthService authService;

    public CollaborationController(CollaborationService collaborationService, AuthService authService) {
        this.collaborationService = collaborationService;
        this.authService = authService;
    }

    @GetMapping
    public ApiResponse<List<PresenceResponse>> getPresence(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PRESENCE_LIST_OK", "Project presence loaded.", collaborationService.getProjectPresence(projectId, user));
    }

    @PostMapping
    public ApiResponse<PresenceResponse> recordPresence(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId,
        @Valid @RequestBody PresenceHeartbeatRequest request
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PRESENCE_RECORDED", "Presence heartbeat recorded.", collaborationService.recordPresence(projectId, request, user));
    }
}
