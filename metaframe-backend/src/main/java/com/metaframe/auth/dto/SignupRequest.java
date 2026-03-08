// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @NotBlank(message = "name is required.")
    @Size(max = 80, message = "name must be 80 characters or fewer.")
    String name,
    @NotBlank(message = "email is required.")
    @Email(message = "email must be a valid email address.")
    String email,
    @NotBlank(message = "password is required.")
    String password,
    String extraIdentifier
) {
}
