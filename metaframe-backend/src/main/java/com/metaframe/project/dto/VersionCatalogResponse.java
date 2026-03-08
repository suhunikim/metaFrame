// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.dto;

import java.util.List;

public record VersionCatalogResponse(
    List<VersionPresetResponse> presets,
    List<ProjectTemplateResponse> templates,
    List<LayoutPresetResponse> layoutPresets
) {
}
