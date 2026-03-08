// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.service;

import com.metaframe.common.auth.AuthenticatedUser;
import com.metaframe.common.audit.AuditRepository;
import com.metaframe.common.exception.ApiException;
import com.metaframe.common.util.JsonSupport;
import com.metaframe.filetree.entity.FileNodeEntity;
import com.metaframe.filetree.repository.FileTreeRepository;
import com.metaframe.page.entity.ManagedPageEntity;
import com.metaframe.page.repository.PageRepository;
import com.metaframe.project.dto.CreateProjectRequest;
import com.metaframe.project.dto.ProjectDetailResponse;
import com.metaframe.project.dto.ProjectSummaryResponse;
import com.metaframe.project.mapper.ProjectMapper;
import com.metaframe.project.repository.ProjectRepository;
import com.metaframe.revision.repository.RevisionRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final FileTreeRepository fileTreeRepository;
    private final PageRepository pageRepository;
    private final AuditRepository auditRepository;
    private final ProjectMapper projectMapper;
    private final ProjectBootstrapFactory projectBootstrapFactory;
    private final RevisionRepository revisionRepository;
    private final JsonSupport jsonSupport;

    public ProjectService(
        ProjectRepository projectRepository,
        FileTreeRepository fileTreeRepository,
        PageRepository pageRepository,
        AuditRepository auditRepository,
        ProjectMapper projectMapper,
        ProjectBootstrapFactory projectBootstrapFactory,
        RevisionRepository revisionRepository,
        JsonSupport jsonSupport
    ) {
        this.projectRepository = projectRepository;
        this.fileTreeRepository = fileTreeRepository;
        this.pageRepository = pageRepository;
        this.auditRepository = auditRepository;
        this.projectMapper = projectMapper;
        this.projectBootstrapFactory = projectBootstrapFactory;
        this.revisionRepository = revisionRepository;
        this.jsonSupport = jsonSupport;
    }

    public List<ProjectSummaryResponse> listProjects(AuthenticatedUser user, String deletedMode, String query, String sort) {
        return projectRepository.findAllProjectSummaries(user.userId(), deletedMode, query, sort)
            .stream()
            .map(projectMapper::toSummary)
            .toList();
    }

    @Transactional
    public ProjectDetailResponse createProject(AuthenticatedUser user, CreateProjectRequest request) {
        OffsetDateTime createdAt = OffsetDateTime.now();
        UUID projectId = UUID.randomUUID();
        // - Role: Build every bootstrap artifact up front so the initial project is transactionally consistent.
        ProjectBootstrapBundle bundle = projectBootstrapFactory.build(
            projectId,
            request.projectName(),
            request.projectDescription(),
            request.templateType(),
            "1.0.0",
            request.versionPreset(),
            request.reactVersion(),
            request.viteVersion(),
            request.layoutPreset(),
            user.userId(),
            user.email(),
            createdAt
        );

        projectRepository.insertProject(bundle.project());
        projectRepository.insertProjectMember(bundle.ownerMember());
        fileTreeRepository.insertFileNodes(bundle.files());
        pageRepository.insertCanonicalSnapshots(bundle.snapshots());
        pageRepository.insertManagedLayout(bundle.layout());
        pageRepository.insertManagedPage(bundle.page());
        pageRepository.insertRouterEntry(bundle.routerEntry());
        revisionRepository.insertRevisions(bundle.revisions());
        auditRepository.insertActivity(bundle.initialActivity());
        projectRepository.markProjectOpened(projectId, user.userId(), createdAt);

        return getProjectDetail(projectId, user, false);
    }

    public ProjectDetailResponse getProjectDetail(UUID projectId, AuthenticatedUser user, boolean markOpened) {
        var project = requireOpenProject(projectId, user);
        if (markOpened) {
            projectRepository.markProjectOpened(projectId, user.userId(), OffsetDateTime.now());
            project = requireOpenProject(projectId, user);
        }
        List<FileNodeEntity> files = fileTreeRepository.findProjectFiles(projectId);
        return projectMapper.toDetail(project, files);
    }

    public List<com.metaframe.project.dto.FileNodeResponse> getProjectTree(UUID projectId, AuthenticatedUser user) {
        requireOpenProject(projectId, user);
        return fileTreeRepository.findProjectFiles(projectId)
            .stream()
            .map(projectMapper::toFileNode)
            .toList();
    }

    public ManagedPageEntity getManagedPage(UUID projectId, UUID fileId, AuthenticatedUser user) {
        requireOpenProject(projectId, user);
        return pageRepository.findManagedPageByFileId(projectId, fileId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MANAGED_PAGE_NOT_FOUND", "The requested managed page could not be found."));
    }

    @Transactional
    public void softDeleteProject(UUID projectId, AuthenticatedUser user) {
        var project = getAccessibleProject(projectId, user);
        ensureManagerRole(project.currentUserRole());
        if (project.isDeleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "PROJECT_ALREADY_DELETED", "The project is already in the deleted state.");
        }

        OffsetDateTime now = OffsetDateTime.now();
        projectRepository.softDeleteProject(projectId, user.userId(), now);
        recordProjectActivity(projectId, user.userId(), "project.deleted", "deletedBy", now);
    }

    @Transactional
    public void restoreProject(UUID projectId, AuthenticatedUser user) {
        var project = getAccessibleProject(projectId, user);
        ensureManagerRole(project.currentUserRole());
        if (!project.isDeleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "PROJECT_NOT_DELETED", "The project is not in the deleted state.");
        }

        OffsetDateTime now = OffsetDateTime.now();
        projectRepository.restoreProject(projectId, now);
        recordProjectActivity(projectId, user.userId(), "project.restored", "restoredBy", now);
    }

    public void touchProject(UUID projectId, OffsetDateTime updatedAt) {
        projectRepository.touchProject(projectId, updatedAt);
    }

    private com.metaframe.project.entity.ProjectEntity requireOpenProject(UUID projectId, AuthenticatedUser user) {
        var project = getAccessibleProject(projectId, user);
        if (project.isDeleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "PROJECT_DELETED", "The requested project is in the deleted state and must be restored before it can be opened.");
        }

        return project;
    }

    private com.metaframe.project.entity.ProjectEntity getAccessibleProject(UUID projectId, AuthenticatedUser user) {
        return projectRepository.findProjectSummary(projectId, user.userId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "The requested project could not be found."));
    }

    private void ensureManagerRole(String role) {
        if (!"owner".equalsIgnoreCase(role) && !"admin".equalsIgnoreCase(role)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "PROJECT_ROLE_FORBIDDEN", "This action requires owner or admin permissions.");
        }
    }

    private void recordProjectActivity(
        UUID projectId,
        String actorUserId,
        String action,
        String payloadKey,
        OffsetDateTime occurredAt
    ) {
        // - Role: Keep soft-delete and restore audit payloads on one shared shape.
        auditRepository.insertActivity(new com.metaframe.common.audit.ActivityLogEntity(
            UUID.randomUUID(),
            projectId,
            actorUserId,
            action,
            "project",
            projectId,
            jsonSupport.toJsonNode(java.util.Map.of(payloadKey, actorUserId)),
            occurredAt
        ));
    }
}
