// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectDetailResponse(
    UUID projectId,
    String projectName,
    String projectDescription,
    String templateType,
    String schemaVersion,
    String versionPreset,
    String reactVersion,
    String viteVersion,
    String layoutPreset,
    String ownerUserId,
    String ownerEmail,
    String currentUserRole,
    boolean autosaveEnabled,
    String collaborationMode,
    boolean isDeleted,
    OffsetDateTime deletedAt,
    String deletedBy,
    OffsetDateTime lastOpenedAt,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    long pageCount,
    long layoutCount,
    List<FileNodeResponse> files
) {
}
