// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.common.response;

import java.time.OffsetDateTime;

public final class ApiResponses {

    private ApiResponses() {
    }

    public static <T> ApiResponse<T> success(String code, String message, T data) {
        return new ApiResponse<>(true, code, message, data, OffsetDateTime.now());
    }

    public static ApiResponse<Void> success(String code, String message) {
        return success(code, message, null);
    }
}
