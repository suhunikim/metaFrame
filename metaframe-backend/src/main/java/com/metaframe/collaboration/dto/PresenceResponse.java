// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.collaboration.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PresenceResponse(
    UUID presenceId,
    UUID projectId,
    String userId,
    UUID fileId,
    UUID pageId,
    UUID layoutId,
    String openMode,
    boolean isViewing,
    boolean isEditing,
    String sessionId,
    OffsetDateTime lastHeartbeat
) {
}
