// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.common.auth;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AuthenticatedUser(
    String userId,
    String email,
    String displayName,
    String globalRole,
    String accountStatus,
    String themePreference,
    int uiFontSize,
    int autosaveInterval,
    UUID sessionId,
    OffsetDateTime sessionExpiresAt
) {
}
