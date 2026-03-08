// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.entity;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.OffsetDateTime;
import java.util.UUID;

public record RevisionEntity(
    UUID revisionId,
    UUID projectId,
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
