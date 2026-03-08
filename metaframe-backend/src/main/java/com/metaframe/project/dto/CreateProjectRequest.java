// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
    @NotBlank(message = "projectName is required.") String projectName,
    @Size(max = 300, message = "projectDescription must be 300 characters or fewer.") String projectDescription,
    @NotBlank(message = "templateType is required.") String templateType,
    @NotBlank(message = "versionPreset is required.") String versionPreset,
    @NotBlank(message = "reactVersion is required.") String reactVersion,
    @NotBlank(message = "viteVersion is required.") String viteVersion,
    @NotBlank(message = "layoutPreset is required.") String layoutPreset
) {
}
