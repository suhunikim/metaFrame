// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

import java.time.OffsetDateTime;

public record LoginResponse(
    String sessionToken,
    OffsetDateTime expiresAt,
    CurrentUserResponse currentUser
) {
}
