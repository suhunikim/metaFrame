// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

public record CurrentUserResponse(
    String userId,
    String email,
    String displayName,
    String globalRole,
    String accountStatus,
    String themePreference,
    int uiFontSize,
    int autosaveInterval
) {
}
