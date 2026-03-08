// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserSessionEntity(
    UUID sessionId,
    String userId,
    String sessionTokenHash,
    OffsetDateTime expiresAt,
    OffsetDateTime lastAccessedAt,
    OffsetDateTime createdAt,
    OffsetDateTime revokedAt,
    String userAgent,
    String clientIp
) {
}
