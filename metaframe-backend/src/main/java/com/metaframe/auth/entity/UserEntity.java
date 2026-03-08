// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.entity;

import java.time.OffsetDateTime;

public record UserEntity(
    String userId,
    String email,
    String displayName,
    String passwordHash,
    String globalRole,
    String accountStatus,
    String extraIdentifier,
    String themePreference,
    int uiFontSize,
    int autosaveInterval,
    OffsetDateTime approvedAt,
    String approvedBy,
    OffsetDateTime lastLoginAt,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
