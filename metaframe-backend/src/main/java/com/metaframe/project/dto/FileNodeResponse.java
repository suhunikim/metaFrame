// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record FileNodeResponse(
    UUID fileId,
    UUID projectId,
    UUID parentId,
    String name,
    String path,
    String nodeType,
    String managedType,
    String extension,
    boolean isProtected,
    boolean isDeleted,
    int nodeOrder,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
