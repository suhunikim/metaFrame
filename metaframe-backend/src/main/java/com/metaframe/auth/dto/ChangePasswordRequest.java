// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
    @NotBlank(message = "currentPassword is required.")
    String currentPassword,
    @NotBlank(message = "newPassword is required.")
    String newPassword
) {
}
