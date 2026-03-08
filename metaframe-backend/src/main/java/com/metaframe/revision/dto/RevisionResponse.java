// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.OffsetDateTime;
import java.util.UUID;

public record RevisionResponse(
    UUID revisionId,
    String scopeType,
    UUID scopeId,
    UUID fileId,
    String saveType,
    String summary,
    String schemaVersion,
    JsonNode snapshot,
    UUID parentRevisionId,
    String createdBy,
    OffsetDateTime createdAt
) {
}
