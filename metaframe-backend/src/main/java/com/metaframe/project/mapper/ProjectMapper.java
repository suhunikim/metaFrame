// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.mapper;

import com.metaframe.filetree.entity.FileNodeEntity;
import com.metaframe.project.dto.FileNodeResponse;
import com.metaframe.project.dto.ProjectDetailResponse;
import com.metaframe.project.dto.ProjectSummaryResponse;
import com.metaframe.project.entity.ProjectEntity;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectSummaryResponse toSummary(ProjectEntity entity) {
        return new ProjectSummaryResponse(
            entity.projectId(),
            entity.projectName(),
            entity.projectDescription(),
            entity.templateType(),
            entity.schemaVersion(),
            entity.versionPreset(),
            entity.reactVersion(),
            entity.viteVersion(),
            entity.layoutPreset(),
            entity.ownerUserId(),
            entity.ownerEmail(),
            entity.currentUserRole(),
            entity.autosaveEnabled(),
            entity.collaborationMode(),
            entity.isDeleted(),
            entity.deletedAt(),
            entity.deletedBy(),
            entity.lastOpenedAt(),
            entity.createdAt(),
            entity.updatedAt(),
            entity.pageCount(),
            entity.layoutCount()
        );
    }

    public ProjectDetailResponse toDetail(ProjectEntity entity, List<FileNodeEntity> files) {
        return new ProjectDetailResponse(
            entity.projectId(),
            entity.projectName(),
            entity.projectDescription(),
            entity.templateType(),
            entity.schemaVersion(),
            entity.versionPreset(),
            entity.reactVersion(),
            entity.viteVersion(),
            entity.layoutPreset(),
            entity.ownerUserId(),
            entity.ownerEmail(),
            entity.currentUserRole(),
            entity.autosaveEnabled(),
            entity.collaborationMode(),
            entity.isDeleted(),
            entity.deletedAt(),
            entity.deletedBy(),
            entity.lastOpenedAt(),
            entity.createdAt(),
            entity.updatedAt(),
            entity.pageCount(),
            entity.layoutCount(),
            files.stream().map(this::toFileNode).toList()
        );
    }

    public FileNodeResponse toFileNode(FileNodeEntity entity) {
        return new FileNodeResponse(
            entity.fileId(),
            entity.projectId(),
            entity.parentId(),
            entity.name(),
            entity.path(),
            entity.nodeType(),
            entity.managedType(),
            entity.extension(),
            entity.isProtected(),
            entity.isDeleted(),
            entity.nodeOrder(),
            entity.createdAt(),
            entity.updatedAt()
        );
    }
}
