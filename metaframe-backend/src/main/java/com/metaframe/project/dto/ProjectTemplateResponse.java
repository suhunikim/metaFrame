// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.dto;

public record ProjectTemplateResponse(
    String key,
    String label,
    String description,
    String defaultLayoutPreset
) {
}
