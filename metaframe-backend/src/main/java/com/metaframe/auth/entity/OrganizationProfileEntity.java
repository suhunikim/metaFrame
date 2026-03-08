// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record OrganizationProfileEntity(
    UUID organizationId,
    String organizationName,
    boolean bootstrapCompleted,
    boolean selfSignupEnabled,
    String signupMode,
    String createdBy,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
