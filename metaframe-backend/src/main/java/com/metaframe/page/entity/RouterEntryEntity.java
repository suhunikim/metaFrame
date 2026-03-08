// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.page.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RouterEntryEntity(
    UUID routeId,
    UUID projectId,
    UUID pageId,
    String routePath,
    UUID layoutId,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
