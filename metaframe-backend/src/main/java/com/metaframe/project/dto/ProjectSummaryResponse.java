// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectSummaryResponse(
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
    long layoutCount
) {
}
