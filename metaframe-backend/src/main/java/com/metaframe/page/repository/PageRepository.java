// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.page.repository;

import com.metaframe.common.util.JsonSupport;
import com.metaframe.page.entity.CanonicalSnapshotEntity;
import com.metaframe.page.entity.ManagedLayoutEntity;
import com.metaframe.page.entity.ManagedPageEntity;
import com.metaframe.page.entity.RouterEntryEntity;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PageRepository {

    private final JdbcTemplate jdbcTemplate;
    private final JsonSupport jsonSupport;

    public PageRepository(JdbcTemplate jdbcTemplate, JsonSupport jsonSupport) {
        this.jdbcTemplate = jdbcTemplate;
        this.jsonSupport = jsonSupport;
    }

    public Optional<ManagedPageEntity> findManagedPageByFileId(UUID projectId, UUID fileId) {
        List<ManagedPageEntity> rows = jdbcTemplate.query(
            """
                SELECT
                  mp.page_id,
                  mp.file_id,
                  mp.project_id,
                  mp.page_name,
                  mp.route_path,
                  mp.linked_layout_id,
                  mp.canonical_snapshot_id,
                  mp.revision_head_id,
                  mp.schema_version,
                  mp.editability_state,
                  mp.export_state,
                  cs.snapshot,
                  mp.created_at,
                  mp.updated_at
                FROM managed_page mp
                JOIN canonical_snapshot cs
                  ON cs.snapshot_id = mp.canonical_snapshot_id
                WHERE mp.project_id = ?
                  AND mp.file_id = ?
                """,
            this::mapManagedPage,
            projectId,
            fileId
        );
        return rows.stream().findFirst();
    }

    public void insertCanonicalSnapshots(List<CanonicalSnapshotEntity> snapshots) {
        for (CanonicalSnapshotEntity snapshot : snapshots) {
            jdbcTemplate.update(
                """
                    INSERT INTO canonical_snapshot (
                      snapshot_id,
                      project_id,
                      scope_type,
                      scope_id,
                      schema_version,
                      snapshot,
                      checksum,
                      created_at,
                      updated_at
                    ) VALUES (?, ?, ?, ?, ?, CAST(? AS jsonb), ?, ?, ?)
                    """,
                snapshot.snapshotId(),
                snapshot.projectId(),
                snapshot.scopeType(),
                snapshot.scopeId(),
                snapshot.schemaVersion(),
                jsonSupport.write(snapshot.snapshot()),
                snapshot.checksum(),
                snapshot.createdAt(),
                snapshot.updatedAt()
            );
        }
    }

    public void insertManagedLayout(ManagedLayoutEntity layout) {
        jdbcTemplate.update(
            """
                INSERT INTO managed_layout (
                  layout_id,
                  project_id,
                  file_id,
                  canonical_snapshot_id,
                  layout_name,
                  revision_head_id,
                  schema_version,
                  editability_state,
                  export_state,
                  created_at,
                  updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            layout.layoutId(),
            layout.projectId(),
            layout.fileId(),
            layout.canonicalSnapshotId(),
            layout.layoutName(),
            layout.revisionHeadId(),
            layout.schemaVersion(),
            layout.editabilityState(),
            layout.exportState(),
            layout.createdAt(),
            layout.updatedAt()
        );
    }

    public void insertManagedPage(ManagedPageEntity page) {
        jdbcTemplate.update(
            """
                INSERT INTO managed_page (
                  page_id,
                  project_id,
                  file_id,
                  canonical_snapshot_id,
                  page_name,
                  route_path,
                  linked_layout_id,
                  revision_head_id,
                  schema_version,
                  editability_state,
                  export_state,
                  created_at,
                  updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
            page.pageId(),
            page.projectId(),
            page.fileId(),
            page.canonicalSnapshotId(),
            page.pageName(),
            page.routePath(),
            page.linkedLayoutId(),
            page.revisionHeadId(),
            page.schemaVersion(),
            page.editabilityState(),
            page.exportState(),
            page.createdAt(),
            page.updatedAt()
        );
    }

    public void insertRouterEntry(RouterEntryEntity route) {
        jdbcTemplate.update(
            """
                INSERT INTO router_entry (
                  route_id,
                  project_id,
                  page_id,
                  route_path,
                  layout_id,
                  created_at,
                  updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
            route.routeId(),
            route.projectId(),
            route.pageId(),
            route.routePath(),
            route.layoutId(),
            route.createdAt(),
            route.updatedAt()
        );
    }

    public void updateManagedPageAfterSave(
        UUID projectId,
        UUID fileId,
        UUID canonicalSnapshotId,
        UUID revisionHeadId,
        String routePath,
        UUID linkedLayoutId,
        OffsetDateTime updatedAt
    ) {
        jdbcTemplate.update(
            """
                UPDATE managed_page
                SET
                  canonical_snapshot_id = ?,
                  revision_head_id = ?,
                  route_path = ?,
                  linked_layout_id = ?,
                  updated_at = ?
                WHERE project_id = ?
                  AND file_id = ?
                """,
            canonicalSnapshotId,
            revisionHeadId,
            routePath,
            linkedLayoutId,
            updatedAt,
            projectId,
            fileId
        );
    }

    public void updateRouterEntryForPage(UUID projectId, UUID pageId, String routePath, UUID layoutId, OffsetDateTime updatedAt) {
        jdbcTemplate.update(
            """
                UPDATE router_entry
                SET
                  route_path = ?,
                  layout_id = ?,
                  updated_at = ?
                WHERE project_id = ?
                  AND page_id = ?
                """,
            routePath,
            layoutId,
            updatedAt,
            projectId,
            pageId
        );
    }

    private ManagedPageEntity mapManagedPage(ResultSet rs, int rowNum) throws SQLException {
        return new ManagedPageEntity(
            rs.getObject("page_id", UUID.class),
            rs.getObject("file_id", UUID.class),
            rs.getObject("project_id", UUID.class),
            rs.getString("page_name"),
            rs.getString("route_path"),
            rs.getObject("linked_layout_id", UUID.class),
            rs.getObject("canonical_snapshot_id", UUID.class),
            rs.getObject("revision_head_id", UUID.class),
            rs.getString("schema_version"),
            rs.getString("editability_state"),
            rs.getString("export_state"),
            jsonSupport.readTree(rs.getString("snapshot")),
            rs.getObject("created_at", OffsetDateTime.class),
            rs.getObject("updated_at", OffsetDateTime.class)
        );
    }
}
