// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.service;

import com.metaframe.project.dto.LayoutPresetResponse;
import com.metaframe.project.dto.ProjectTemplateResponse;
import com.metaframe.project.dto.VersionCatalogResponse;
import com.metaframe.project.dto.VersionPresetResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VersionCatalogService {

    public VersionCatalogResponse getCatalog() {
        return new VersionCatalogResponse(
            List.of(
                new VersionPresetResponse("stable", "Stable", "Recommended React 18 production baseline.", "18.3.1", "5.4.19", true),
                new VersionPresetResponse("previous-stable", "Previous Stable", "Conservative compatibility baseline.", "18.2.0", "5.2.14", false),
                new VersionPresetResponse("latest", "Latest", "Latest approved React 18 catalog entry.", "18.3.1", "5.4.19", false)
            ),
            List.of(
                new ProjectTemplateResponse("stable-recommended", "Admin Dashboard", "Managed React dashboard starter.", "main-layout"),
                new ProjectTemplateResponse("empty", "Empty Workspace", "Minimal managed shell without starter widgets.", "blank-layout")
            ),
            List.of(
                new LayoutPresetResponse("main-layout", "Main Layout", "Header + content workspace starter."),
                new LayoutPresetResponse("blank-layout", "Blank Layout", "Empty shell ready for custom structure.")
            )
        );
    }
}
