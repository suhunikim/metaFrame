// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.service;

import com.metaframe.common.auth.AuthenticatedUser;
import com.metaframe.common.audit.ActivityLogEntity;
import com.metaframe.common.audit.AuditRepository;
import com.metaframe.common.exception.ApiException;
import com.metaframe.common.util.JsonSupport;
import com.metaframe.page.entity.CanonicalSnapshotEntity;
import com.metaframe.page.entity.ManagedPageEntity;
import com.metaframe.page.repository.PageRepository;
import com.metaframe.project.service.ProjectService;
import com.metaframe.revision.dto.RevisionResponse;
import com.metaframe.revision.dto.SaveManagedPageRequest;
import com.metaframe.revision.entity.RevisionEntity;
import com.metaframe.revision.mapper.RevisionMapper;
import com.metaframe.revision.repository.RevisionRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SaveService {

    private static final Set<String> ALLOWED_SAVE_TYPES = Set.of("manual", "autosave", "system", "restore");

    private final PageRepository pageRepository;
    private final RevisionRepository revisionRepository;
    private final AuditRepository auditRepository;
    private final RevisionMapper revisionMapper;
    private final ProjectService projectService;
    private final JsonSupport jsonSupport;

    public SaveService(
        PageRepository pageRepository,
        RevisionRepository revisionRepository,
        AuditRepository auditRepository,
        RevisionMapper revisionMapper,
        ProjectService projectService,
        JsonSupport jsonSupport
    ) {
        this.pageRepository = pageRepository;
        this.revisionRepository = revisionRepository;
        this.auditRepository = auditRepository;
        this.revisionMapper = revisionMapper;
        this.projectService = projectService;
        this.jsonSupport = jsonSupport;
    }

    public List<RevisionResponse> getRevisionHistory(UUID projectId, UUID fileId, AuthenticatedUser user) {
        projectService.getProjectDetail(projectId, user, false);
        return revisionRepository.findRevisionHistoryByFileId(projectId, fileId)
            .stream()
            .map(revisionMapper::toResponse)
            .toList();
    }

    @Transactional
    public RevisionResponse saveManagedPage(UUID projectId, SaveManagedPageRequest request, AuthenticatedUser user) {
        if (!ALLOWED_SAVE_TYPES.contains(request.saveType())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_SAVE_TYPE", "saveType must be one of manual, autosave, system, or restore.");
        }

        OffsetDateTime savedAt = OffsetDateTime.now();
        ManagedPageEntity existing = projectService.getManagedPage(projectId, request.fileId(), user);
        UUID snapshotId = UUID.randomUUID();
        UUID revisionId = UUID.randomUUID();

        CanonicalSnapshotEntity snapshot = new CanonicalSnapshotEntity(
            snapshotId,
            projectId,
            "page",
            existing.pageId(),
            existing.schemaVersion(),
            request.snapshot(),
            null,
            savedAt,
            savedAt
        );

        RevisionEntity revision = new RevisionEntity(
            revisionId,
            projectId,
            "page",
            existing.pageId(),
            request.fileId(),
            request.saveType(),
            request.summary(),
            existing.schemaVersion(),
            request.snapshot(),
            existing.revisionHeadId(),
            user.userId(),
            savedAt
        );

        pageRepository.insertCanonicalSnapshots(List.of(snapshot));
        revisionRepository.insertRevision(revision);
        pageRepository.updateManagedPageAfterSave(
            projectId,
            request.fileId(),
            snapshotId,
            revisionId,
            request.routePath(),
            request.linkedLayoutId(),
            savedAt
        );
        pageRepository.updateRouterEntryForPage(projectId, existing.pageId(), request.routePath(), request.linkedLayoutId(), savedAt);
        auditRepository.insertActivity(
            new ActivityLogEntity(
                UUID.randomUUID(),
                projectId,
                user.userId(),
                "page.saved",
                "page",
                existing.pageId(),
                jsonSupport.toJsonNode(java.util.Map.of(
                    "fileId", request.fileId().toString(),
                    "saveType", request.saveType(),
                    "routePath", request.routePath()
                )),
                savedAt
            )
        );
        projectService.touchProject(projectId, savedAt);

        return revisionMapper.toResponse(revision);
    }
}
