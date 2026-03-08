// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.controller;

import com.metaframe.auth.service.AuthService;
import com.metaframe.common.response.ApiResponse;
import com.metaframe.common.response.ApiResponses;
import com.metaframe.revision.dto.RevisionResponse;
import com.metaframe.revision.dto.SaveManagedPageRequest;
import com.metaframe.revision.service.SaveService;
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
@RequestMapping("/api/projects/{projectId}")
public class RevisionController {

    private final SaveService saveService;
    private final AuthService authService;

    public RevisionController(SaveService saveService, AuthService authService) {
        this.saveService = saveService;
        this.authService = authService;
    }

    @GetMapping("/revisions/{fileId}")
    public ApiResponse<List<RevisionResponse>> getRevisionHistory(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId,
        @PathVariable UUID fileId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("REVISION_HISTORY_OK", "Revision history loaded.", saveService.getRevisionHistory(projectId, fileId, user));
    }

    @PostMapping("/save/page")
    public ApiResponse<RevisionResponse> saveManagedPage(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId,
        @Valid @RequestBody SaveManagedPageRequest request
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PAGE_SAVE_OK", "Managed page saved.", saveService.saveManagedPage(projectId, request, user));
    }
}
