// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.collaboration.service;

import com.metaframe.collaboration.dto.PresenceHeartbeatRequest;
import com.metaframe.collaboration.dto.PresenceResponse;
import com.metaframe.collaboration.entity.FilePresenceEntity;
import com.metaframe.collaboration.mapper.CollaborationMapper;
import com.metaframe.collaboration.repository.CollaborationRepository;
import com.metaframe.common.auth.AuthenticatedUser;
import com.metaframe.common.exception.ApiException;
import com.metaframe.page.entity.ManagedPageEntity;
import com.metaframe.project.service.ProjectService;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CollaborationService {

    private static final Set<String> ALLOWED_OPEN_MODES = Set.of("design", "source", "preview");

    private final CollaborationRepository collaborationRepository;
    private final CollaborationMapper collaborationMapper;
    private final ProjectService projectService;

    public CollaborationService(
        CollaborationRepository collaborationRepository,
        CollaborationMapper collaborationMapper,
        ProjectService projectService
    ) {
        this.collaborationRepository = collaborationRepository;
        this.collaborationMapper = collaborationMapper;
        this.projectService = projectService;
    }

    public List<PresenceResponse> getProjectPresence(UUID projectId, AuthenticatedUser user) {
        projectService.getProjectDetail(projectId, user, false);
        return collaborationRepository.findProjectPresence(projectId)
            .stream()
            .map(collaborationMapper::toResponse)
            .toList();
    }

    @Transactional
    public PresenceResponse recordPresence(UUID projectId, PresenceHeartbeatRequest request, AuthenticatedUser user) {
        if (!ALLOWED_OPEN_MODES.contains(request.openMode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_OPEN_MODE", "openMode must be one of design, source, or preview.");
        }

        ManagedPageEntity page = projectService.getManagedPage(projectId, request.fileId(), user);
        OffsetDateTime heartbeatAt = OffsetDateTime.now();
        var existingPresenceId = collaborationRepository.findPresenceId(projectId, request.fileId(), user.userId(), request.sessionId());

        FilePresenceEntity entity = new FilePresenceEntity(
            existingPresenceId.orElseGet(UUID::randomUUID),
            projectId,
            user.userId(),
            request.fileId(),
            page.pageId(),
            page.linkedLayoutId(),
            request.openMode(),
            request.isViewing(),
            request.isEditing(),
            request.sessionId(),
            heartbeatAt
        );

        if (existingPresenceId.isPresent()) {
            collaborationRepository.updatePresence(entity);
        } else {
            collaborationRepository.insertPresence(entity);
        }

        return collaborationMapper.toResponse(entity);
    }
}
