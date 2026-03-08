// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccountSettingsRequest(
    @NotBlank(message = "displayName is required.")
    @Size(max = 80, message = "displayName must be 80 characters or fewer.")
    String displayName,
    @NotBlank(message = "themePreference is required.")
    String themePreference,
    @Min(value = 12, message = "uiFontSize must be between 12 and 18.")
    @Max(value = 18, message = "uiFontSize must be between 12 and 18.")
    int uiFontSize,
    @Min(value = 1, message = "autosaveInterval must be between 1 and 30.")
    @Max(value = 30, message = "autosaveInterval must be between 1 and 30.")
    int autosaveInterval
) {
}
