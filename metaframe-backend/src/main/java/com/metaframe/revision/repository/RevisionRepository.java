// - Role: Defines a backend implementation unit.
// - Notes: This file works with nearby controllers, services, or repositories.

package com.metaframe.revision.repository;

import com.metaframe.common.util.JsonSupport;
import com.metaframe.revision.entity.RevisionEntity;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RevisionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final JsonSupport jsonSupport;

    public RevisionRepository(JdbcTemplate jdbcTemplate, JsonSupport jsonSupport) {
        this.jdbcTemplate = jdbcTemplate;
        this.jsonSupport = jsonSupport;
    }

    public List<RevisionEntity> findRevisionHistoryByFileId(UUID projectId, UUID fileId) {
        return jdbcTemplate.query(
            """
                SELECT
                  revision_id,
                  project_id,
                  scope_type,
                  scope_id,
                  file_id,
                  save_type,
                  summary,
                  schema_version,
                  snapshot,
                  parent_revision_id,
                  created_by,
                  created_at
                FROM revision
                WHERE project_id = ?
                  AND file_id = ?
                ORDER BY created_at DESC
                """,
            this::mapRevision,
            projectId,
            fileId
        );
    }

    public void insertRevisions(List<RevisionEntity> revisions) {
        for (RevisionEntity revision : revisions) {
            insertRevision(revision);
        }
    }

    public void insertRevision(RevisionEntity revision) {
        jdbcTemplate.update(
            """
                INSERT INTO revision (
                  revision_id,
                  project_id,
                  scope_type,
                  scope_id,
                  file_id,
                  save_type,
                  summary,
                  schema_version,
                  snapshot,
                  parent_revision_id,
                  created_by,
                  created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS jsonb), ?, ?, ?)
                """,
            revision.revisionId(),
            revision.projectId(),
            revision.scopeType(),
            revision.scopeId(),
            revision.fileId(),
            revision.saveType(),
            revision.summary(),
            revision.schemaVersion(),
            jsonSupport.write(revision.snapshot()),
            revision.parentRevisionId(),
            revision.createdBy(),
            revision.createdAt()
        );
    }

    private RevisionEntity mapRevision(ResultSet rs, int rowNum) throws SQLException {
        return new RevisionEntity(
            rs.getObject("revision_id", UUID.class),
            rs.getObject("project_id", UUID.class),
            rs.getString("scope_type"),
            rs.getObject("scope_id", UUID.class),
            rs.getObject("file_id", UUID.class),
            rs.getString("save_type"),
            rs.getString("summary"),
            rs.getString("schema_version"),
            jsonSupport.readTree(rs.getString("snapshot")),
            rs.getObject("parent_revision_id", UUID.class),
            rs.getString("created_by"),
            rs.getObject("created_at", java.time.OffsetDateTime.class)
        );
    }
}
