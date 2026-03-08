// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.project.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.metaframe.common.audit.ActivityLogEntity;
import com.metaframe.common.util.JsonSupport;
import com.metaframe.filetree.entity.FileNodeEntity;
import com.metaframe.page.entity.CanonicalSnapshotEntity;
import com.metaframe.page.entity.ManagedLayoutEntity;
import com.metaframe.page.entity.ManagedPageEntity;
import com.metaframe.page.entity.RouterEntryEntity;
import com.metaframe.project.entity.ProjectEntity;
import com.metaframe.project.entity.ProjectMemberEntity;
import com.metaframe.revision.entity.RevisionEntity;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProjectBootstrapFactory {

    private final JsonSupport jsonSupport;

    public ProjectBootstrapFactory(JsonSupport jsonSupport) {
        this.jsonSupport = jsonSupport;
    }

    public ProjectBootstrapBundle build(
        UUID projectId,
        String projectName,
        String projectDescription,
        String templateType,
        String schemaVersion,
        String versionPreset,
        String reactVersion,
        String viteVersion,
        String layoutPreset,
        String ownerUserId,
        String ownerEmail,
        OffsetDateTime createdAt
    ) {
        UUID rootFolderId = UUID.randomUUID();
        UUID srcFolderId = UUID.randomUUID();
        UUID pagesFolderId = UUID.randomUUID();
        UUID layoutsFolderId = UUID.randomUUID();
        UUID componentsFolderId = UUID.randomUUID();
        UUID packageFileId = UUID.randomUUID();
        UUID appFileId = UUID.randomUUID();
        UUID mainFileId = UUID.randomUUID();
        UUID pageFileId = UUID.randomUUID();
        UUID layoutFileId = UUID.randomUUID();
        UUID searchToolbarFileId = UUID.randomUUID();
        UUID pageId = UUID.randomUUID();
        UUID layoutId = UUID.randomUUID();
        UUID pageSnapshotId = UUID.randomUUID();
        UUID layoutSnapshotId = UUID.randomUUID();
        UUID pageRevisionId = UUID.randomUUID();
        UUID layoutRevisionId = UUID.randomUUID();
        UUID routeId = UUID.randomUUID();

        JsonNode layoutSnapshot = buildLayoutSnapshot(layoutId, layoutFileId, schemaVersion);
        JsonNode pageSnapshot = buildPageSnapshot(pageId, pageFileId, layoutId, schemaVersion);

        ProjectEntity project = new ProjectEntity(
            projectId,
            projectName,
            projectDescription,
            templateType,
            schemaVersion,
            versionPreset,
            reactVersion,
            viteVersion,
            layoutPreset,
            "soft-lock",
            true,
            ownerUserId,
            ownerEmail,
            false,
            null,
            null,
            "owner",
            createdAt,
            createdAt,
            createdAt,
            1,
            1
        );
        ProjectMemberEntity ownerMember = new ProjectMemberEntity(projectId, ownerUserId, "owner", "active", createdAt, null, true);

        List<FileNodeEntity> files = List.of(
            file(rootFolderId, projectId, null, projectName, "/", "folder", "folder", null, false, 0, createdAt),
            file(srcFolderId, projectId, rootFolderId, "src", "/src", "folder", "folder", null, false, 0, createdAt),
            file(pagesFolderId, projectId, srcFolderId, "pages", "/src/pages", "folder", "folder", null, false, 0, createdAt),
            file(layoutsFolderId, projectId, srcFolderId, "layouts", "/src/layouts", "folder", "folder", null, false, 1, createdAt),
            file(componentsFolderId, projectId, srcFolderId, "components", "/src/components", "folder", "folder", null, false, 2, createdAt),
            file(pageFileId, projectId, pagesFolderId, "HomePage.tsx", "/src/pages/HomePage.tsx", "file", "page", "tsx", false, 0, createdAt),
            file(layoutFileId, projectId, layoutsFolderId, "MainLayout.tsx", "/src/layouts/MainLayout.tsx", "file", "layout", "tsx", false, 0, createdAt),
            file(searchToolbarFileId, projectId, componentsFolderId, "SearchToolbar.tsx", "/src/components/SearchToolbar.tsx", "file", "general", "tsx", false, 0, createdAt),
            file(appFileId, projectId, srcFolderId, "App.tsx", "/src/App.tsx", "file", "system", "tsx", true, 3, createdAt),
            file(mainFileId, projectId, srcFolderId, "main.tsx", "/src/main.tsx", "file", "system", "tsx", true, 4, createdAt),
            file(packageFileId, projectId, rootFolderId, "package.json", "/package.json", "file", "system", "json", true, 1, createdAt)
        );

        CanonicalSnapshotEntity layoutCanonicalSnapshot = new CanonicalSnapshotEntity(layoutSnapshotId, projectId, "layout", layoutId, schemaVersion, layoutSnapshot, null, createdAt, createdAt);
        CanonicalSnapshotEntity pageCanonicalSnapshot = new CanonicalSnapshotEntity(pageSnapshotId, projectId, "page", pageId, schemaVersion, pageSnapshot, null, createdAt, createdAt);
        ManagedLayoutEntity layout = new ManagedLayoutEntity(layoutId, projectId, layoutFileId, layoutSnapshotId, "Main Layout", layoutRevisionId, schemaVersion, "editable", "exportable", createdAt, createdAt);
        ManagedPageEntity page = new ManagedPageEntity(pageId, pageFileId, projectId, "Home Page", "/", layoutId, pageSnapshotId, pageRevisionId, schemaVersion, "editable", "exportable", pageSnapshot, createdAt, createdAt);
        RouterEntryEntity routerEntry = new RouterEntryEntity(routeId, projectId, pageId, "/", layoutId, createdAt, createdAt);
        List<RevisionEntity> revisions = List.of(
            new RevisionEntity(layoutRevisionId, projectId, "layout", layoutId, layoutFileId, "manual", "Initial layout bootstrap", schemaVersion, layoutSnapshot, null, ownerUserId, createdAt),
            new RevisionEntity(pageRevisionId, projectId, "page", pageId, pageFileId, "manual", "Initial page bootstrap", schemaVersion, pageSnapshot, null, ownerUserId, createdAt)
        );
        ActivityLogEntity activity = new ActivityLogEntity(
            UUID.randomUUID(),
            projectId,
            ownerUserId,
            "project.created",
            "project",
            projectId,
            jsonSupport.toJsonNode(map("templateType", templateType, "schemaVersion", schemaVersion)),
            createdAt
        );

        return new ProjectBootstrapBundle(
            project,
            ownerMember,
            files,
            List.of(layoutCanonicalSnapshot, pageCanonicalSnapshot),
            layout,
            page,
            routerEntry,
            revisions,
            activity
        );
    }

    private FileNodeEntity file(UUID fileId, UUID projectId, UUID parentId, String name, String path, String nodeType, String managedType, String extension, boolean isProtected, int nodeOrder, OffsetDateTime createdAt) {
        return new FileNodeEntity(fileId, projectId, parentId, name, path, nodeType, managedType, extension, isProtected, false, nodeOrder, createdAt, createdAt);
    }

    private JsonNode buildLayoutSnapshot(UUID layoutId, UUID fileId, String schemaVersion) {
        return jsonSupport.toJsonNode(map(
            "layoutId", layoutId.toString(),
            "fileId", fileId.toString(),
            "schemaVersion", schemaVersion,
            "stateFlags", stateFlags(),
            "rootNodeId", "layout-root",
            "nodes", map(
                "layout-root", map("id", "layout-root", "kind", "html", "tag", "div", "name", "MainLayoutRoot", "children", List.of("layout-header", "layout-content"), "props", map(), "slot", null, "bindings", List.of(), "events", List.of(), "layout", map("kind", "flex"), "styleRef", "layout-root", "baseStyle", map("display", "flex", "flexDirection", "column", "minHeight", "100vh", "backgroundColor", "#0f1115"), "responsiveOverrides", map(), "metadata", map("depth", 0)),
                "layout-header", map("id", "layout-header", "kind", "html", "tag", "header", "name", "App Header", "children", List.of(), "props", map("text", "MetaFrame Workspace"), "slot", "header", "bindings", List.of(), "events", List.of(), "layout", map("kind", "flow"), "styleRef", "layout-header", "baseStyle", map("padding", "20px 24px", "color", "#f5f7fa", "fontWeight", 700, "borderBottom", "1px solid #2a2f3a"), "responsiveOverrides", map(), "metadata", map("depth", 1)),
                "layout-content", map("id", "layout-content", "kind", "html", "tag", "section", "name", "Page Outlet", "children", List.of(), "props", map(), "slot", "content", "bindings", List.of(), "events", List.of(), "layout", map("kind", "flow"), "styleRef", "layout-content", "baseStyle", map("padding", "24px"), "responsiveOverrides", map(), "metadata", map("depth", 1))
            )
        ));
    }

    private JsonNode buildPageSnapshot(UUID pageId, UUID fileId, UUID layoutId, String schemaVersion) {
        return jsonSupport.toJsonNode(map(
            "pageId", pageId.toString(),
            "fileId", fileId.toString(),
            "routePath", "/",
            "layoutId", layoutId.toString(),
            "schemaVersion", schemaVersion,
            "revision", 1,
            "stateFlags", stateFlags(),
            "rootNodeId", "page-root",
            "nodes", map(
                "page-root", map("id", "page-root", "name", "HomePageRoot", "kind", "html", "tag", "section", "props", map(), "children", List.of("hero-section", "search-toolbar"), "layout", map("kind", "flow"), "slot", null, "bindings", List.of(), "events", List.of(), "styleRef", "home-page", "baseStyle", map("display", "flex", "flexDirection", "column", "gap", "24px", "padding", "24px"), "responsiveOverrides", map("mobile", map("padding", "16px", "gap", "16px")), "metadata", map("depth", 0)),
                "hero-section", map("id", "hero-section", "name", "Hero Section", "kind", "html", "tag", "div", "props", map(), "children", List.of("hero-title", "hero-description"), "layout", map("kind", "flex"), "slot", null, "bindings", List.of(), "events", List.of(), "styleRef", "home-page__hero", "baseStyle", map("display", "flex", "flexDirection", "column", "gap", "12px", "backgroundColor", "#181c26", "padding", "24px", "borderRadius", "18px"), "responsiveOverrides", map("mobile", map("padding", "18px")), "metadata", map("depth", 1)),
                "hero-title", map("id", "hero-title", "name", "Hero Title", "kind", "html", "tag", "p", "props", map("text", "MetaFrame Dashboard"), "children", List.of(), "layout", map("kind", "flow"), "slot", null, "bindings", List.of(), "events", List.of(), "styleRef", "home-page__hero-title", "baseStyle", map("fontSize", "28px", "fontWeight", 700, "color", "#f5f7fa", "margin", "0"), "responsiveOverrides", map("mobile", map("fontSize", "22px")), "metadata", map("depth", 2)),
                "hero-description", map("id", "hero-description", "name", "Hero Description", "kind", "html", "tag", "p", "props", map("text", "Visual source IDE for managed React project editing."), "children", List.of(), "layout", map("kind", "flow"), "slot", null, "bindings", List.of(), "events", List.of(), "styleRef", "home-page__hero-description", "baseStyle", map("color", "#c0c4cc", "margin", "0"), "responsiveOverrides", map(), "metadata", map("depth", 2)),
                "search-toolbar", map("id", "search-toolbar", "name", "Search Toolbar", "kind", "widget", "componentName", "Card", "props", map("title", "Quick Search"), "children", List.of("search-input", "search-button"), "layout", map("kind", "flex"), "slot", "content", "bindings", List.of(), "events", List.of(), "styleRef", "home-page__search-toolbar", "baseStyle", map("display", "flex", "gap", "12px", "padding", "16px", "alignItems", "center"), "responsiveOverrides", map("mobile", map("flexDirection", "column", "alignItems", "stretch")), "metadata", map("depth", 1)),
                "search-input", map("id", "search-input", "name", "Keyword Input", "kind", "widget", "componentName", "Input", "props", map("placeholder", "Search project assets"), "children", List.of(), "layout", map("kind", "flex", "order", 0), "slot", null, "bindings", List.of(map("key", "value", "expression", "{{pageState.keyword}}", "source", "pageState")), "events", List.of(map("eventName", "onChange", "handlerName", "handleKeywordChange", "kind", "action")), "styleRef", "home-page__search-input", "baseStyle", map("minWidth", "280px"), "responsiveOverrides", map("mobile", map("minWidth", "100%", "width", "100%")), "metadata", map("depth", 2)),
                "search-button", map("id", "search-button", "name", "Search Button", "kind", "widget", "componentName", "Button", "props", map("type", "primary", "text", "Search"), "children", List.of(), "layout", map("kind", "flex", "order", 1), "slot", null, "bindings", List.of(), "events", List.of(map("eventName", "onClick", "handlerName", "handleSearch", "kind", "action")), "styleRef", "home-page__search-button", "baseStyle", map(), "responsiveOverrides", map("mobile", map("width", "100%")), "metadata", map("depth", 2))
            )
        ));
    }

    private Map<String, Object> stateFlags() {
        return map("dirty", false, "synced", true, "warning", false, "locked", false, "conflict", false, "parseError", false, "exportable", true, "nonExportable", false, "readOnly", false, "recoveryAvailable", false);
    }

    private Map<String, Object> map(Object... values) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (int index = 0; index < values.length; index += 2) {
            result.put((String) values[index], values[index + 1]);
        }
        return result;
    }
}
