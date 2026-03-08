// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.page.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ManagedLayoutEntity(
    UUID layoutId,
    UUID projectId,
    UUID fileId,
    UUID canonicalSnapshotId,
    String layoutName,
    UUID revisionHeadId,
    String schemaVersion,
    String editabilityState,
    String exportState,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
