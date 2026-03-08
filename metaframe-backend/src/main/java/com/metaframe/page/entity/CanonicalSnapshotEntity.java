// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.page.entity;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.OffsetDateTime;
import java.util.UUID;

public record CanonicalSnapshotEntity(
    UUID snapshotId,
    UUID projectId,
    String scopeType,
    UUID scopeId,
    String schemaVersion,
    JsonNode snapshot,
    String checksum,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
