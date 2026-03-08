// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.controller;

import com.metaframe.common.response.ApiResponse;
import com.metaframe.common.response.ApiResponses;
import com.metaframe.auth.service.AuthService;
import com.metaframe.page.mapper.PageMapper;
import com.metaframe.project.dto.CreateProjectRequest;
import com.metaframe.project.dto.FileNodeResponse;
import com.metaframe.project.dto.ProjectDetailResponse;
import com.metaframe.project.dto.ProjectSummaryResponse;
import com.metaframe.project.service.ProjectService;
import com.metaframe.project.dto.VersionCatalogResponse;
import com.metaframe.project.service.VersionCatalogService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final PageMapper pageMapper;
    private final AuthService authService;
    private final VersionCatalogService versionCatalogService;

    public ProjectController(
        ProjectService projectService,
        PageMapper pageMapper,
        AuthService authService,
        VersionCatalogService versionCatalogService
    ) {
        this.projectService = projectService;
        this.pageMapper = pageMapper;
        this.authService = authService;
        this.versionCatalogService = versionCatalogService;
    }

    @GetMapping
    public ApiResponse<List<ProjectSummaryResponse>> listProjects(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @RequestParam(defaultValue = "active") String deletedMode,
        @RequestParam(required = false) String query,
        @RequestParam(defaultValue = "updated_desc") String sort
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success(
            "PROJECT_LIST_OK",
            "Project list loaded.",
            projectService.listProjects(user, deletedMode, query, sort)
        );
    }

    @PostMapping
    public ApiResponse<ProjectDetailResponse> createProject(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @Valid @RequestBody CreateProjectRequest request
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PROJECT_CREATED", "Project created successfully.", projectService.createProject(user, request));
    }

    @GetMapping("/{projectId}")
    public ApiResponse<ProjectDetailResponse> getProject(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PROJECT_DETAIL_OK", "Project detail loaded.", projectService.getProjectDetail(projectId, user, true));
    }

    @GetMapping("/{projectId}/tree")
    public ApiResponse<List<FileNodeResponse>> getProjectTree(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PROJECT_TREE_OK", "Project tree loaded.", projectService.getProjectTree(projectId, user));
    }

    @GetMapping("/{projectId}/pages/{fileId}")
    public ApiResponse<com.metaframe.page.dto.ManagedPageResponse> getManagedPage(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId,
        @PathVariable UUID fileId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("MANAGED_PAGE_OK", "Managed page loaded.", pageMapper.toResponse(projectService.getManagedPage(projectId, fileId, user)));
    }

    @PostMapping("/{projectId}/trash")
    public ApiResponse<Void> trashProject(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        projectService.softDeleteProject(projectId, user);
        return ApiResponses.success("PROJECT_TRASHED", "Project moved to deleted state.");
    }

    @PostMapping("/{projectId}/restore")
    public ApiResponse<Void> restoreProject(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable UUID projectId
    ) {
        var user = authService.requireAuthenticatedUser(authorizationHeader);
        projectService.restoreProject(projectId, user);
        return ApiResponses.success("PROJECT_RESTORED", "Project restored successfully.");
    }

    @GetMapping("/version-catalog")
    public ApiResponse<VersionCatalogResponse> getVersionCatalog(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        authService.requireAuthenticatedUser(authorizationHeader);
        return ApiResponses.success("PROJECT_VERSION_CATALOG_OK", "Project version catalog loaded.", versionCatalogService.getCatalog());
    }
}
