// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BootstrapAdminRequest(
    @NotBlank(message = "organizationName is required.")
    @Size(max = 120, message = "organizationName must be 120 characters or fewer.")
    String organizationName,
    @NotBlank(message = "adminName is required.")
    @Size(max = 80, message = "adminName must be 80 characters or fewer.")
    String adminName,
    @NotBlank(message = "adminEmail is required.")
    @Email(message = "adminEmail must be a valid email address.")
    String adminEmail,
    @NotBlank(message = "password is required.")
    String password
) {
}
