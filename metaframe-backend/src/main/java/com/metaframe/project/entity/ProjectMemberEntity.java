// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectMemberEntity(
    UUID projectId,
    String userId,
    String role,
    String status,
    OffsetDateTime joinedAt,
    String invitedBy,
    boolean isActive
) {
}
