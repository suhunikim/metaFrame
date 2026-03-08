// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.page.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ManagedPageResponse(
    UUID pageId,
    UUID fileId,
    UUID projectId,
    String pageName,
    String routePath,
    UUID linkedLayoutId,
    UUID canonicalSnapshotId,
    UUID revisionHeadId,
    String schemaVersion,
    String editabilityState,
    String exportState,
    JsonNode snapshot,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
