// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.auth.dto;

public record SignupResponse(
    String userId,
    String email,
    String status
) {
}
