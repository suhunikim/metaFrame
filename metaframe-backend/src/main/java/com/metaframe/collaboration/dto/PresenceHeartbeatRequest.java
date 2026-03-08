// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.collaboration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PresenceHeartbeatRequest(
    @NotNull(message = "fileId is required.") UUID fileId,
    @NotBlank(message = "sessionId is required.") String sessionId,
    @NotBlank(message = "openMode is required.") String openMode,
    boolean isViewing,
    boolean isEditing
) {
}
