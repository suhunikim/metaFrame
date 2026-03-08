// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SaveManagedPageRequest(
    @NotNull(message = "fileId is required.") UUID fileId,
    @NotBlank(message = "saveType is required.") String saveType,
    String summary,
    @NotNull(message = "snapshot is required.") JsonNode snapshot,
    @NotBlank(message = "routePath is required.") String routePath,
    @NotNull(message = "linkedLayoutId is required.") UUID linkedLayoutId
) {
}
