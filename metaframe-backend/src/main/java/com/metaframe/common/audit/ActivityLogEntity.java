// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.common.audit;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ActivityLogEntity(
    UUID activityId,
    UUID projectId,
    String actorUserId,
    String actionType,
    String targetType,
    UUID targetId,
    JsonNode payload,
    OffsetDateTime createdAt
) {
}
