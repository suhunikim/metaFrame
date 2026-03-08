// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectEntity(
    UUID projectId,
    String projectName,
    String projectDescription,
    String templateType,
    String schemaVersion,
    String versionPreset,
    String reactVersion,
    String viteVersion,
    String layoutPreset,
    String collaborationMode,
    boolean autosaveEnabled,
    String ownerUserId,
    String ownerEmail,
    boolean isDeleted,
    OffsetDateTime deletedAt,
    String deletedBy,
    String currentUserRole,
    OffsetDateTime lastOpenedAt,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    long pageCount,
    long layoutCount
) {
}
