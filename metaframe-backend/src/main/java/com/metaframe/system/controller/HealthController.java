// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.system.controller;

import com.metaframe.common.response.ApiResponse;
import com.metaframe.common.response.ApiResponses;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ApiResponse<Map<String, String>> health() {
        return ApiResponses.success("HEALTH_OK", "MetaFrame backend is healthy.", Map.of("status", "ok"));
    }
}
