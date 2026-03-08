// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.common.response;

import java.time.OffsetDateTime;

public record ApiResponse<T>(
    boolean success,
    String code,
    String message,
    T data,
    OffsetDateTime timestamp
) {
}
